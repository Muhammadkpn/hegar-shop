const database = require('../../database');
const { asyncQuery, today } = require('../../helpers/queryHelper');

module.exports = {
    getBlog: async (req, res) => {
        const {
            search, categories, tags, _sort, _order,
        } = req.query;

        try {
            // get article with tag and category blog
            let getArticle = `SELECT b.*, uk.full_name AS author_name, tb_2.category AS category, tb_1.tags FROM blog b
                LEFT JOIN user_ktp uk ON b.author_id = uk.user_id
                LEFT JOIN ( SELECT bt.blog_id, GROUP_CONCAT(bt.tag_id) AS tag_id, GROUP_CONCAT(t.name) AS tags FROM blog_tag bt
                    JOIN tag_blog t ON bt.tag_id = t.id
                    GROUP BY bt.blog_id
                ) tb_1 ON b.id = tb_1.blog_id
                LEFT JOIN ( SELECT bc.blog_id, GROUP_CONCAT(bc.category_id) AS category_id, GROUP_CONCAT(cb.name) AS category FROM blog_category bc 
                    JOIN category_blog cb ON bc.category_id = cb.id
                    GROUP BY bc.blog_id
                ) tb_2 ON b.id = tb_2.blog_id
                WHERE b.status = 1 `;

            // type of query
            const checkSearch = Object.prototype.hasOwnProperty.call(req.query, 'search');
            const checkCategory = Object.prototype.hasOwnProperty.call(req.query, 'categories');
            const checkTag = Object.prototype.hasOwnProperty.call(req.query, 'tags');
            if (checkSearch && checkCategory && checkTag) {
                getArticle += ` AND b.title LIKE '%${search}%' AND tb_2.category LIKE '%${categories}%' AND tb_1.tags LIKE '%${tags}%'`;
            } else if (checkSearch && checkCategory) {
                getArticle += ` AND b.title LIKE '%${search}%' AND tb_2.category LIKE '%${categories}%'`;
            } else if (checkSearch && checkTag) {
                getArticle += ` AND b.title LIKE '%${search}%' AND tb_1.tags LIKE '%${tags}%'`;
            } else if (checkTag && checkCategory) {
                getArticle += ` AND tb_2.category LIKE '%${categories}%' AND tb_1.tags LIKE '%${tags}%'`;
            } else if (checkSearch) {
                getArticle += ` AND b.title LIKE '%${search}%'`;
            } else if (checkCategory) {
                getArticle += ` AND tb_2.category LIKE '%${categories}%'`;
            } else if (checkTag) {
                getArticle += ` AND tb_1.tags LIKE '%${tags}%'`;
            }

            // check sort query
            let sort = '';
            if (_sort) {
                sort += ` ORDER BY ${_sort} ${_order ? _order.toUpperCase() : 'ASC'}`;
            }

            getArticle += ` ${sort.length === 0 ? 'ORDER BY b.date DESC' : sort}`;
            const result = await asyncQuery(getArticle);

            // convert data from string to array
            let tempCategory = [];
            let tempTags = [];
            result.forEach((item, index) => {
                if (item.category && item.tags) {
                    tempCategory = item.category.split(',');
                    tempTags = item.tags.split(',');

                    result[index].category = tempCategory;
                    result[index].tags = tempTags;
                }
            });

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getAdminBlog: async (req, res) => {
        const {
            titles, _sort, _order, status,
        } = req.query;

        try {
            // get article with tag and category blog
            let getArticle = `SELECT b.*, uk.full_name AS author_name, tb_2.category AS category, tb_1.tags FROM blog b
                LEFT JOIN user_ktp uk ON b.author_id = uk.user_id
                JOIN ( SELECT bt.blog_id, GROUP_CONCAT(bt.tag_id) AS tag_id, GROUP_CONCAT(t.name) AS tags FROM blog_tag bt
                    JOIN tag_blog t ON bt.tag_id = t.id
                    GROUP BY bt.blog_id
                ) tb_1 ON b.id = tb_1.blog_id
                JOIN ( SELECT bc.blog_id, GROUP_CONCAT(bc.category_id) AS category_id, GROUP_CONCAT(cb.name) AS category FROM blog_category bc 
                    JOIN category_blog cb ON bc.category_id = cb.id
                    GROUP BY bc.blog_id
                ) tb_2 ON b.id = tb_2.blog_id`;

            // type of query
            const checkQuery = (key) => Object.prototype.hasOwnProperty.call(req.query, key);
            if (checkQuery('titles') && checkQuery('status')) {
                getArticle += ` WHERE b.title LIKE '%${titles}%' ${status !== 'All' ? `AND b.status = ${status}` : ''}`;
            } else if (checkQuery('titles')) {
                getArticle += ` WHERE b.title LIKE '%${titles}%'`;
            } else if (checkQuery('status') && status !== 'All') {
                getArticle += ` WHERE b.status = '${status}'`;
            }

            // check sort query
            let sort = '';
            if (_sort) {
                sort += ` ORDER BY ${_sort} ${_order ? _order.toUpperCase() : 'ASC'}`;
            }

            getArticle += ` ${sort.length === 0 ? 'ORDER BY b.date DESC' : sort}`;
            const result = await asyncQuery(getArticle);

            // convert data from string to array
            let tempCategory = [];
            let tempTags = [];
            result.forEach((item, index) => {
                tempCategory = item.category.split(',');
                tempTags = item.tags.split(',');

                result[index].category = tempCategory;
                result[index].tags = tempTags;
            });

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getDetailsBlog: async (req, res) => {
        const { id } = req.params;

        try {
            // get article with tag an}d category blog
            const getArticle = `SELECT b.*, uk.full_name AS author_name, tb_2.category AS category, tb_1.tags FROM blog b
                LEFT JOIN user_ktp uk ON b.author_id = uk.user_id
                LEFT JOIN ( SELECT bt.blog_id, GROUP_CONCAT(bt.tag_id) AS tag_id, GROUP_CONCAT(t.name) AS tags FROM blog_tag bt
                    JOIN tag_blog t ON bt.tag_id = t.id
                    GROUP BY bt.blog_id
                ) tb_1 ON b.id = tb_1.blog_id
                LEFT JOIN ( SELECT bc.blog_id, GROUP_CONCAT(bc.category_id) AS category_id, GROUP_CONCAT(cb.name) AS category FROM blog_category bc 
                    JOIN category_blog cb ON bc.category_id = cb.id
                    GROUP BY bc.blog_id
                ) tb_2 ON b.id = tb_2.blog_id
                WHERE b.id = ${database.escape(id)} AND b.status = 1`;

            const result = await asyncQuery(getArticle);

            // convert data from string to array
            let category = [];
            let tags = [];

            result.forEach((item, index) => {
                if (item.category && item.tags) {
                    category = item.category.split(',');
                    tags = item.tags.split(',');
                    result[index].category = category;
                    result[index].tags = tags;
                }
            });

            // check result
            if (result.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Your article not found',
                });
                return;
            }

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: result[0],
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getOthersBlog: async (req, res) => {
        const { id } = req.params;
        try {
            // sort blog by date
            const query = 'SELECT * FROM blog ORDER BY date DESC;';
            const result = await asyncQuery(query);

            // get index of article
            let idx;
            result.map((item, index) => {
                if (item.id === parseInt(id, 10)) {
                    idx = index;
                }
                return idx;
            });

            // filter article by index to get others article
            let result2;
            if (idx === 0) {
                result2 = result.filter((item, index) => index === idx + 1 || index === idx);
            } else if (idx === result.length - 1) {
                result2 = result.filter((item, index) => index === idx || index === idx - 1);
            } else {
                result2 = result.filter((item, index) => index < idx + 2 && index >= idx - 1);
            }

            // delete article itself to get next and prev article in array
            if (result2.length === 3) {
                result2.splice(1, 1);
            } else if (result2.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Your other articles not found',
                });
                return;
            }

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: result2,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    getPopularBlog: async (req, res) => {
        try {
            // get top four popular article by view
            const query = 'SELECT * FROM blog WHERE status = 1 ORDER BY view DESC LIMIT 4';
            const result = await asyncQuery(query);

            res.status(200).send({
                status: 'success',
                message: 'Your request has been successfully',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    countView: async (req, res) => {
        const { id } = req.params;
        try {
            const blog = `SELECT id, title, view FROM blog WHERE id = ${database.escape(id)}`;
            const getBlog = await asyncQuery(blog);

            if (getBlog.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: 'Article not found',
                });
                return;
            }

            // insert count
            const newCount = parseInt(getBlog[0].view, 10) + 1;
            const countView = `UPDATE blog SET view = ${newCount} WHERE id = ${database.escape(id)}`;
            await asyncQuery(countView);

            res.status(200).send({
                status: 'success',
                message: 'The number of view has been added',
                data: {
                    id, tittle: getBlog[0].tittle, view: newCount,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    addBlog: async (req, res) => {
        const { title, content, authorId } = req.body;

        // check file upload
        if (req.file === undefined) {
            res.status(400).send({
                status: 'fail',
                code: 400,
                message: 'no image',
            });
            return;
        }

        try {
            const checkTitle = `SELECT * FROM blog WHERE title = ${database.escape(title)}`;
            const getCheckTitle = await asyncQuery(checkTitle);

            if (getCheckTitle.length > 0) {
                res.status(403).send({
                    status: 'fail',
                    code: 403,
                    message: 'title have already used. Change the title of blog to add new article',
                });
                return;
            }
            // insert new article
            const addPost = `INSERT INTO blog (title, date, view, content, image, status, author_id) 
                        VALUES (${database.escape(title)}, ${database.escape(today)}, 0, ${database.escape(content)}, 
                        'image/blog/${req.file.filename}', 1, ${database.escape(authorId)})`;
            await asyncQuery(addPost);

            // send response
            res.status(200).send({
                status: 'success',
                message: 'Your new article has been added to database',
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editBlog: async (req, res) => {
        const { title, content } = req.body;
        const { id } = req.params;

        try {
            // check article
            const article = `SELECT * FROM blog WHERE id = ${database.escape(id)}`;
            const checkArticle = await asyncQuery(article);

            if (checkArticle.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Article with id = ${id} doesn't exists`,
                });
                return;
            }

            // edit article data
            const editArticle = `UPDATE blog SET title = ${database.escape(title)}, content = ${database.escape(content)} WHERE id = ${id}`;
            await asyncQuery(editArticle);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Article with id: ${id} has been edited`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    editBlogImage: async (req, res) => {
        const { id } = req.params;

        try {
            // check file upload
            if (req.file === undefined) {
                res.status(400).send({
                    status: 'fail',
                    code: 400,
                    message: 'no image',
                });
                return;
            }

            // check article
            const article = `SELECT * FROM blog WHERE id = ${database.escape(id)}`;
            const checkArticle = await asyncQuery(article);

            if (checkArticle.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Article with id = ${id} doesn't exists`,
                });
                return;
            }

            // edit article data
            const editArticle = `UPDATE blog SET ${req.file ? `image = '/image/blog/${req.file.filename}'` : ''} WHERE id = ${id}`;
            await asyncQuery(editArticle);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Image of article with id: ${id} has been edited`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
    deleteBlog: async (req, res) => {
        const { id } = req.params;
        try {
            // check article
            const article = `SELECT * FROM blog WHERE id = ${database.escape(id)}`;
            const checkArticle = await asyncQuery(article);

            if (checkArticle.length === 0) {
                res.status(404).send({
                    status: 'fail',
                    code: 404,
                    message: `Article with id = ${id} doesn't exists`,
                });
                return;
            }

            // delete article
            const delPost = `DELETE FROM blog WHERE id = ${database.escape(id)}`;
            await asyncQuery(delPost);

            // delete article category
            const delArticleCategory = `DELETE FROM blog_category WHERE blog_id = ${database.escape(id)}`;
            await asyncQuery(delArticleCategory);

            // delete article comment
            const delComment = `DELETE FROM blog_comment WHERE blog_id = ${database.escape(id)}`;
            await asyncQuery(delComment);

            // delete article tags
            const delArticleTag = `DELETE FROM blog_tag WHERE blog_id = ${database.escape(id)}`;
            await asyncQuery(delArticleTag);

            // send response
            res.status(200).send({
                status: 'success',
                message: `Article with id: ${id} has been deleted`,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                status: 'fail',
                code: 500,
                message: error.message,
            });
        }
    },
};
