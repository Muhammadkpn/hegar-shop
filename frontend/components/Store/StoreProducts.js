import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import ModalComp from '../../components/Common/modalComp';
import { useDispatch, useSelector } from 'react-redux';
import {
    getProductStore,
    getProductImage,
    deleteProductImage,
    addProductImage,
    getCategoryProduct,
    editProductCategoryByStore,
    getTagProduct,
    editProductTagByStore,
    editProduct,
    deleteProduct,
    addProductStore,
    getProductReview,
    getProductDetails,
    editProductReview,
} from '../../store/action';
import { getFullImageUrl } from '../../store/helpers';

const StoreProducts = () => {
    const [detailMode, setDetailMode] = React.useState(null);
    const [dataProduct, setDataProduct] = React.useState({});
    const [description, setDescription] = React.useState('');
    const [fileImage, setFileImage] = React.useState({
        mode: 'view',
        data: [{ id: null, image: '', files: '' }],
        selectedIndex: null,
        deleteImage: [],
        uploadImage: [],
    });
    const [checkboxCategory, setCheckboxCategory] = React.useState([
        {
            id: null,
            name: '',
            isChecked: false,
        },
    ]);
    const [checkboxTag, setCheckboxTag] = React.useState([
        {
            id: null,
            name: '',
            isChecked: false,
        },
    ]);
    const [dataAddProduct, setDataAddProduct] = React.useState({});
    const [addImage, setAddImage] = React.useState([]);
    const [deleteId, setDeleteId] = React.useState(null);
    const [productStatus, setProductStatus] = React.useState({
        status_id: null,
        product_id: null,
        store_id: null,
    });
    const [alert, setAlert] = React.useState('');

    const {
        productStore,
        user_id,
        categoryProduct,
        tagProduct,
        productImage,
        productReview,
        productDetails,
    } = useSelector((state) => {
        return {
            user_id: state.users.id,
            productStore: state.products.productStore,
            categoryProduct: state.categoryProduct.categoryProduct,
            tagProduct: state.tagProduct.tagProduct,
            productImage: state.products.productImage,
            productReview: state.productReview.productReview,
            productDetails: state.products.productDetails,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getProductStore(user_id));
        dispatch(getCategoryProduct());
        dispatch(getTagProduct());
        dispatch(getProductImage());
    }, []);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('.carousel').carousel();
        $('#edit_product').on('hidden.bs.modal', function (e) {
            setCheckboxCategory([{ id: null, name: '', isChecked: false }]);
            setCheckboxTag([{ id: null, name: '', isChecked: false }]);
            setFileImage({
                mode: 'view',
                data: [{ id: null, image: '', files: '' }],
                selectedIndex: null,
                deleteImage: [],
                uploadImage: [],
            });
            setDataProduct({});
            setDescription('');
        });
        $('#add_product').on('hidden.bs.modal', function (e) {
            setCheckboxCategory([{ id: null, name: '', isChecked: false }]);
            setCheckboxTag([{ id: null, name: '', isChecked: false }]);
            setDataAddProduct({});
            setDescription('');
            setAddImage([]);
            document.getElementById('upload-add-image').value = '';
        });
        $('#delete_product').on('hidden.bs.modal', function (e) {
            setDeleteId(null);
        });
    });

    const handleEditProduct = (item) => {
        let tempCat = [];
        let tempTag = [];

        setDetailMode(true);
        setDataProduct(item);
        setDescription(item.description);
        categoryProduct.forEach((element) => {
            tempCat.push({
                id: element.id,
                name: element.name,
                isChecked: item.category.indexOf(element.name) !== -1,
            });
        });
        setCheckboxCategory(tempCat);
        tagProduct.forEach((element) => {
            tempTag.push({
                id: element.id,
                name: element.name,
                isChecked: item.tags.indexOf(element.name) !== -1,
            });
        });
        setCheckboxTag(tempTag);

        let img = productImage.filter((element) => element.product_id === item.id);
        let tempImg = [];
        img.forEach((element) => {
            tempImg.push({ id: element.id, image: element.image, files: '' });
        });
        setFileImage({ ...fileImage, data: [...tempImg] });
        $('#edit_product').modal();
    };

    const submitEditProduct = () => {
        const { data, deleteImage } = fileImage;
        const {
            name,
            id: product_id,
            store_id,
            stock,
            regular_price,
            sale_price,
            weight,
        } = dataProduct;

        // upload image
        let formData = new FormData();
        data?.forEach((item) => {
            if (!item.id) {
                formData.append('IMG', item.files);
            }
        });
        dispatch(addProductImage(product_id, store_id, formData));

        // delete image
        if (deleteImage.length !== 0) {
            deleteImage.forEach((item) => {
                dispatch(deleteProductImage(item.id));
            });
        }

        // edit category
        const categoryId = [];
        checkboxCategory.forEach((item) => {
            if (item.isChecked) {
                categoryId.push(item.id);
            }
        });
        if (categoryId.length > 0) {
            dispatch(editProductCategoryByStore({ categoryId }, product_id, store_id));
        } else {
            setAlert('Product category still empty, please fill the category of product!');
            $('#alert_message').modal();
            return;
        }

        // edit tag
        const tagId = [];
        checkboxTag.forEach((item) => {
            if (item.isChecked) {
                tagId.push(item.id);
            }
        });
        if (categoryId.length > 0) {
            dispatch(editProductTagByStore({ tagId }, product_id, store_id));
        } else {
            setAlert('Product tag still empty, please fill the category of product!');
            $('#alert_message').modal();
            return;
        }

        // edit product
        if (
            name &&
            weight &&
            stock &&
            regular_price &&
            sale_price &&
            product_id &&
            description &&
            store_id
        ) {
            dispatch(
                editProduct(
                    { name, weight, stock, regular_price, sale_price, description },
                    product_id,
                    store_id
                )
            );
        } else {
            setAlert('Data product in this form still error, please change the data of product!');
            $('#alert_message').modal();
            return;
        }
    };

    const renderEditProduct = () => {
        const { name, stock, weight, regular_price, sale_price, released_date, updated_date } =
            dataProduct;
        const { mode, data, selectedIndex, uploadImage, deleteImage } = fileImage;

        return (
            <div>
                <div className='row'>
                    <div className='col-sm-12 col-md-6'>
                        {mode === 'edit' ? (
                            <div>
                                <img
                                    src={
                                        data[selectedIndex ? selectedIndex : 0].id
                                            ? getFullImageUrl(
                                                  data[selectedIndex ? selectedIndex : 0].image
                                              )
                                            : data[selectedIndex ? selectedIndex : 0].id
                                    }
                                    className='img-edit-product'
                                    alt='img-product'
                                />
                                <div className='input-group mx-auto'>
                                    <select
                                        className='custom-select'
                                        id='inputGroupSelect04'
                                        aria-label='Example select with button addon'
                                        onChange={(e) =>
                                            setFileImage({
                                                ...fileImage,
                                                selectedIndex: e.target.value,
                                            })
                                        }
                                    >
                                        <option value={'null'} selected>
                                            Choose Image...
                                        </option>
                                        {data.map((item, index) => (
                                            <option value={index}>
                                                {item.image.replace('image/products/', '')}
                                            </option>
                                        ))}
                                    </select>
                                    <div className='input-group-append'>
                                        <button
                                            className='btn btn-outline-primary'
                                            type='button'
                                            onClick={() =>
                                                setFileImage({
                                                    ...fileImage,
                                                    mode: 'view',
                                                    selectedIndex: null,
                                                })
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className='btn btn-outline-primary'
                                            type='button'
                                            onClick={() => {
                                                let tempArr = [...data];
                                                let tempImg = [...deleteImage];
                                                tempImg.push(tempArr[selectedIndex]);
                                                tempArr.splice(selectedIndex, 1);
                                                setFileImage({
                                                    mode: 'view',
                                                    data: [...tempArr],
                                                    selectedIndex: null,
                                                    deleteImage: [...tempImg],
                                                });
                                            }}
                                            disabled={!selectedIndex}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div
                                    id='carousel_image_product'
                                    className='carousel slide'
                                    data-ride='carousel'
                                >
                                    <div className='carousel-inner'>
                                        {data?.map((item, index) => {
                                            return (
                                                <div
                                                    className={`carousel-item ${
                                                        index === 0 ? 'active' : ''
                                                    }`}
                                                    key={index}
                                                >
                                                    <img
                                                        src={
                                                            item.id
                                                                ? getFullImageUrl(item.image)
                                                                : item.image
                                                        }
                                                        className='img-edit-product'
                                                        alt='img-product'
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <a
                                        className='carousel-control-prev'
                                        href='#carousel_image_product'
                                        role='button'
                                        data-slide='prev'
                                    >
                                        <span
                                            className='carousel-control-prev-icon'
                                            aria-hidden='true'
                                        ></span>
                                        <span className='sr-only'>Previous</span>
                                    </a>
                                    <a
                                        className='carousel-control-next'
                                        href='#carousel_image_product'
                                        role='button'
                                        data-slide='next'
                                    >
                                        <span
                                            className='carousel-control-next-icon'
                                            aria-hidden='true'
                                        ></span>
                                        <span className='sr-only'>Next</span>
                                    </a>
                                </div>
                                <div className='d-flex justify-content-center align-items-center'>
                                    {fileImage.mode === 'add' ? (
                                        <>
                                            <input
                                                type='file'
                                                id='add-product-image'
                                                style={{ display: 'block' }}
                                                onChange={(e) => {
                                                    let tempArr = [];
                                                    for (
                                                        let i = 0;
                                                        i < e.target.files.length;
                                                        i += 1
                                                    ) {
                                                        tempArr.push({
                                                            id: null,
                                                            image: URL.createObjectURL(
                                                                e.target.files[i]
                                                            ),
                                                            files: e.target.files[i],
                                                        });
                                                    }
                                                    setFileImage({
                                                        ...fileImage,
                                                        uploadImage: [...tempArr],
                                                    });
                                                }}
                                                multiple
                                            />
                                            <button
                                                type='button'
                                                className='btn btn-primary btn-sm m-1'
                                                onClick={() =>
                                                    setFileImage({
                                                        ...fileImage,
                                                        mode: 'view',
                                                        selectedIndex: null,
                                                        uploadImage: [],
                                                    })
                                                }
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type='button'
                                                className='btn btn-primary btn-sm m-1'
                                                onClick={() =>
                                                    setFileImage({
                                                        ...fileImage,
                                                        mode: 'view',
                                                        selectedIndex: null,
                                                        data: [...data, ...uploadImage],
                                                        uploadImage: [],
                                                    })
                                                }
                                            >
                                                Submit
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type='button'
                                                className='btn btn-primary btn-sm m-1'
                                                onClick={() =>
                                                    setFileImage({ ...fileImage, mode: 'edit' })
                                                }
                                                disabled={detailMode}
                                            >
                                                Edit Image
                                            </button>
                                            <button
                                                type='button'
                                                className='btn btn-primary btn-sm m-1'
                                                onClick={() =>
                                                    setFileImage({ ...fileImage, mode: 'add' })
                                                }
                                                disabled={detailMode}
                                            >
                                                Add Image
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <div className='form-group mb-3'>
                            <label>Product Name</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Product Name'
                                onChange={(e) =>
                                    setDataProduct({ ...dataProduct, name: e.target.value })
                                }
                                value={name}
                                disabled={detailMode}
                            />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Regular Price</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Regular Price'
                                onChange={(e) =>
                                    setDataProduct({
                                        ...dataProduct,
                                        regular_price: e.target.value,
                                    })
                                }
                                value={parseInt(regular_price)}
                                disabled={detailMode}
                            />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Sale Price</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Sale Price'
                                onChange={(e) =>
                                    setDataProduct({ ...dataProduct, sale_price: e.target.value })
                                }
                                value={parseInt(sale_price)}
                                disabled={detailMode}
                            />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Weight</label>
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Weight'
                                onChange={(e) =>
                                    setDataProduct({ ...dataProduct, weight: e.target.value })
                                }
                                value={weight}
                                disabled={detailMode}
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Stock</label>
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Stock'
                                onChange={(e) =>
                                    setDataProduct({ ...dataProduct, stock: e.target.value })
                                }
                                value={stock}
                                disabled={detailMode}
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Released Date</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder={new Date(released_date).toLocaleString()}
                                disabled
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Updated Date</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder={
                                    updated_date
                                        ? new Date(updated_date).toLocaleString()
                                        : 'Updated Date'
                                }
                                disabled
                            />
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Description</label>
                            <ReactQuill
                                theme='snow'
                                onChange={setDescription}
                                value={description}
                                readOnly={detailMode}
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='dropdown'>
                            <button
                                className='btn btn-outline-primary dropdown-toggle btn-block'
                                type='button'
                                id='categoryButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                Category
                            </button>
                            <div className='dropdown-menu' aria-labelledby='categoryButton'>
                                {checkboxCategory?.map((item, index) => {
                                    return (
                                        <div className='dropdown-item' key={item.id}>
                                            <input
                                                className='form-check-input category-checkbox'
                                                type='checkbox'
                                                value={item.id || 0}
                                                onChange={(e) => {
                                                    let tempArr = [...checkboxCategory];
                                                    tempArr[index].isChecked =
                                                        !tempArr[index].isChecked;
                                                    setCheckboxCategory(tempArr);
                                                }}
                                                checked={item.isChecked}
                                                disabled={detailMode}
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='defaultCheck1'
                                            >
                                                {item.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='dropdown'>
                            <button
                                className='btn btn-outline-primary dropdown-toggle btn-block'
                                type='button'
                                id='tagButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                Tag
                            </button>
                            <div className='dropdown-menu' aria-labelledby='tagButton'>
                                {checkboxTag?.map((item, index) => {
                                    return (
                                        <div className='dropdown-item' key={item.id}>
                                            <input
                                                className='form-check-input'
                                                type='checkbox'
                                                value={item.id || 0}
                                                onChange={(e) => {
                                                    let tempArr = [...checkboxTag];
                                                    tempArr[index].isChecked =
                                                        !tempArr[index].isChecked;
                                                    setCheckboxTag(tempArr);
                                                }}
                                                checked={item.isChecked}
                                                disabled={detailMode}
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='defaultCheck1'
                                            >
                                                {item.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleAddProduct = () => {
        $('#add_product').modal();
        let tempCat = [];
        categoryProduct.forEach((element) => {
            tempCat.push({
                id: element.id,
                name: element.name,
                isChecked: false,
            });
        });
        setCheckboxCategory(tempCat);
        let tempTag = [];
        tagProduct.forEach((element) => {
            tempTag.push({
                id: element.id,
                name: element.name,
                isChecked: false,
            });
        });
        setCheckboxTag(tempTag);
    };

    const submitAddProduct = () => {
        // add product
        const {
            name,
            regular_price: regularPrice,
            sale_price: salePrice,
            stock,
            weight,
        } = dataAddProduct;
        const bodyProduct = {
            name,
            description,
            weight,
            regularPrice,
            salePrice,
            stock,
            storeId: user_id,
            statusId: 1,
        };

        // add product image
        const formData = new FormData();
        addImage.forEach((item) => {
            formData.append('IMG', item.files);
        });
        const bodyImage = { params: 'new-product', formData };

        // add product category
        const bodyCategory = { categoryId: [] };
        checkboxCategory.forEach((item) => {
            if (item.isChecked) {
                bodyCategory.categoryId.push(item.id);
            }
        });

        // add product tag
        const bodyTag = { tagId: [] };
        checkboxTag.forEach((item) => {
            if (item.isChecked) {
                bodyTag.tagId.push(item.id);
            }
        });
        dispatch(addProductStore(bodyProduct, bodyImage, bodyCategory, bodyTag, user_id));
    };

    const renderAddProduct = () => {
        return (
            <div>
                {addImage.length !== 0 ? (
                    <div id='carousel_image_add' className='carousel slide' data-ride='carousel'>
                        <div className='carousel-inner'>
                            {addImage?.map((item, index) => {
                                return (
                                    <div
                                        className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                        key={index}
                                    >
                                        <img
                                            src={item.image}
                                            className='img-edit-product'
                                            alt='img-product'
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <a
                            className='carousel-control-prev'
                            href='#carousel_image_add'
                            role='button'
                            data-slide='prev'
                        >
                            <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                            <span className='sr-only'>Previous</span>
                        </a>
                        <a
                            className='carousel-control-next'
                            href='#carousel_image_add'
                            role='button'
                            data-slide='next'
                        >
                            <span className='carousel-control-next-icon' aria-hidden='true'></span>
                            <span className='sr-only'>Next</span>
                        </a>
                    </div>
                ) : null}
                <div className='form-group d-flex justify-content-center'>
                    <label htmlFor='upload-add-image' className='custom-file-upload'>
                        Upload Image
                    </label>
                    <input
                        type='file'
                        accept='image/*'
                        id='upload-add-image'
                        onChange={(e) => {
                            let files = [];
                            for (let i = 0; i < e.target.files.length; i++) {
                                files.push({
                                    image: URL.createObjectURL(e.target.files[i]),
                                    files: e.target.files[i],
                                });
                            }
                            setAddImage([...files]);
                        }}
                        multiple
                    />
                </div>
                <div className='row'>
                    <div className='col-sm-12'>
                        <div className='form-group'>
                            <label>Product Name</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Product Name'
                                onChange={(e) =>
                                    setDataAddProduct({ ...dataAddProduct, name: e.target.value })
                                }
                                value={dataAddProduct.name || ''}
                            />
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <div className='form-group'>
                            <label>Regular Price</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Regular Price'
                                onChange={(e) =>
                                    setDataAddProduct({
                                        ...dataAddProduct,
                                        regular_price: e.target.value,
                                    })
                                }
                                value={dataAddProduct.regular_price || ''}
                            />
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <div className='form-group'>
                            <label>Sale Price</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Sale Price'
                                onChange={(e) =>
                                    setDataAddProduct({
                                        ...dataAddProduct,
                                        sale_price: e.target.value,
                                    })
                                }
                                value={dataAddProduct.sale_price || ''}
                            />
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <div className='form-group'>
                            <label>Weight</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Weight'
                                onChange={(e) =>
                                    setDataAddProduct({ ...dataAddProduct, weight: e.target.value })
                                }
                                value={dataAddProduct.weight || ''}
                            />
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <div className='form-group'>
                            <label>Stock</label>
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Stock'
                                onChange={(e) =>
                                    setDataAddProduct({ ...dataAddProduct, stock: e.target.value })
                                }
                                value={dataAddProduct.stock || ''}
                            />
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Description</label>
                            <ReactQuill
                                theme='snow'
                                onChange={setDescription}
                                defaultValue={description || ''}
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='dropdown'>
                            <button
                                className='btn btn-outline-primary dropdown-toggle btn-block'
                                type='button'
                                id='categoryButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                Category
                            </button>
                            <div className='dropdown-menu' aria-labelledby='categoryButton'>
                                {checkboxCategory?.map((item, index) => {
                                    return (
                                        <div className='dropdown-item' key={item.id}>
                                            <input
                                                className='form-check-input category-checkbox'
                                                type='checkbox'
                                                value={item.id || 0}
                                                onChange={(e) => {
                                                    let tempArr = [...checkboxCategory];
                                                    tempArr[index].isChecked =
                                                        !tempArr[index].isChecked;
                                                    setCheckboxCategory(tempArr);
                                                }}
                                                checked={item.isChecked}
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='defaultCheck1'
                                            >
                                                {item.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='dropdown'>
                            <button
                                className='btn btn-outline-primary dropdown-toggle btn-block'
                                type='button'
                                id='tagButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                Tag
                            </button>
                            <div className='dropdown-menu' aria-labelledby='tagButton'>
                                {checkboxTag?.map((item, index) => {
                                    return (
                                        <div className='dropdown-item' key={item.id}>
                                            <input
                                                className='form-check-input'
                                                type='checkbox'
                                                value={item.id || 0}
                                                onChange={(e) => {
                                                    let tempArr = [...checkboxTag];
                                                    tempArr[index].isChecked =
                                                        !tempArr[index].isChecked;
                                                    setCheckboxTag(tempArr);
                                                }}
                                                checked={item.isChecked}
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='defaultCheck1'
                                            >
                                                {item.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleViewProductReview = (product_id) => {
        $('#view_product_review_2').modal();
        dispatch(getProductReview(product_id, 'type=product-id'));
        dispatch(getProductDetails(product_id));
    };

    const renderProductReview = () => {
        let star1 = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.round(productDetails.rating)) {
                star1.push('bx bxs-star');
            } else {
                star1.push('bx bx-star');
            }
        }

        return (
            <div>
                {productReview.length > 0 ? (
                    <div className='products-review-form'>
                        <div className='review-title'>
                            <div className='rating'>
                                {star1.map((item, index) => {
                                    return <i key={index} className={item}></i>;
                                })}
                                <span> ({productDetails.rating || 0}/5)</span>
                            </div>
                            <p>Based on {productReview.length} reviews</p>
                        </div>

                        <div className='review-comments'>
                            {productReview.map((item, index) => {
                                let star2 = [];
                                for (let i = 1; i <= 5; i++) {
                                    if (i <= Math.round(item.rating)) {
                                        star2.push('bx bxs-star');
                                    } else {
                                        star2.push('bx bx-star');
                                    }
                                }
                                return (
                                    <div className='review-item' key={index}>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <div className='rating'>
                                                    {star2.map((item, index) => {
                                                        return <i key={index} className={item}></i>;
                                                    })}
                                                </div>
                                                <span>
                                                    <strong>{item.full_name}</strong> on{' '}
                                                    <strong>
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </strong>
                                                </span>
                                                {(item.image || []).map((value, idx) => {
                                                    return (
                                                        <img
                                                            src={getFullImageUrl(value)}
                                                            className='img-review'
                                                            key={idx}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            <button
                                                type='button'
                                                className='btn'
                                                onClick={() =>
                                                    dispatch(
                                                        editProductReview(
                                                            item.status === 1
                                                                ? { status: 2 }
                                                                : { status: 1 },
                                                            item.id,
                                                            productDetails.id
                                                        )
                                                    )
                                                }
                                            >
                                                {item.status === 1 ? 'Show' : 'Hide'}
                                            </button>
                                        </div>
                                        <p>{item.comment}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className='alert alert-secondary'>
                        This product doesn't have a review
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className='store-products-container'>
            <div className='row mb-2 align-items-center'>
                <div className='col-md-6 col-sm-12'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search products'
                            onChange={(e) =>
                                dispatch(getProductStore(user_id, `name=${e.target.value}`))
                            }
                        />
                        <div className='input-group-append'>
                            <button type='button' className='btn btn-primary'>
                                <i className='bx bx-search-alt'></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-6 col-sm-12'>
                    <div className='d-flex justify-content-end'>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() => handleAddProduct()}
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered'>
                    <thead className='thead-light'>
                        <tr>
                            <th className='text-center align-middle'>Image</th>
                            <th className='text-center align-middle'>Name</th>
                            <th className='text-center align-middle'>Stock</th>
                            <th className='text-center align-middle'>Price</th>
                            <th className='text-center align-middle'>Updated Date</th>
                            <th className='text-center align-middle'>Status</th>
                            <th className='text-center align-middle'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productStore.length > 0 ? (
                            productStore.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='align-middle'>
                                            <img
                                                src={getFullImageUrl(item.image[0])}
                                                className='img-store-products'
                                            />
                                        </td>
                                        <td className='align-middle'>{item.name}</td>
                                        <td className='align-middle'>{item.stock}</td>
                                        <td className='align-middle'>
                                            Rp.{item.regular_price.toLocaleString()}
                                        </td>
                                        <td className='align-middle'>
                                            {new Date(item.updated_date).toLocaleString()}
                                        </td>
                                        <td className='align-middle'>
                                            {item.status_id === 1 ? (
                                                <button
                                                    type='button'
                                                    className='btn text-info'
                                                    data-toggle='modal'
                                                    data-target='#activation_product'
                                                    onClick={() =>
                                                        setProductStatus({
                                                            status_id: 2,
                                                            product_id: item.id,
                                                            store_id: item.store_id,
                                                        })
                                                    }
                                                >
                                                    <u>Show</u>
                                                </button>
                                            ) : (
                                                <button
                                                    type='button'
                                                    className='btn text-info'
                                                    data-toggle='modal'
                                                    data-target='#activation_product'
                                                    onClick={() =>
                                                        setProductStatus({
                                                            status_id: 1,
                                                            product_id: item.id,
                                                            store_id: item.store_id,
                                                        })
                                                    }
                                                >
                                                    <u>Hide</u>
                                                </button>
                                            )}
                                        </td>
                                        <td className='align-middle p-0 text-center'>
                                            <button type='button' className='btn p-0'>
                                                <div
                                                    data-toggle='tooltip'
                                                    data-placement='top'
                                                    title='Details'
                                                    onClick={() => handleEditProduct(item)}
                                                >
                                                    <i className='bx bx-detail'></i>
                                                </div>
                                            </button>
                                            <button type='button' className='btn p-0'>
                                                <div
                                                    data-toggle='tooltip'
                                                    data-placement='top'
                                                    title='Product Review'
                                                    onClick={() => handleViewProductReview(item.id)}
                                                >
                                                    <i className='bx bx-comment-detail'></i>
                                                </div>
                                            </button>
                                            <button type='button' className='btn p-0'>
                                                <div
                                                    data-toggle='tooltip'
                                                    data-placement='top'
                                                    title='Delete'
                                                    onClick={() => {
                                                        $('#delete_product').modal();
                                                        setDeleteId(item.id);
                                                    }}
                                                >
                                                    <i className='bx bxs-trash-alt'></i>
                                                </div>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className='alert alert-secondary text-center'>
                                <td colSpan={7}>
                                    We can't found your keyword. Please change your keyword!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComp
                modal_id={'edit_product'}
                size='modal-lg'
                scrollable={true}
                title={detailMode ? 'Product Detail' : 'Edit Product'}
                body={renderEditProduct()}
                footer={
                    detailMode ? (
                        <button
                            type='button'
                            className='btn btn-primary btn-sm m-1 mx-auto'
                            onClick={() => setDetailMode(false)}
                        >
                            Edit
                        </button>
                    ) : (
                        <div className='mx-auto'>
                            <button
                                type='button'
                                className='btn btn-primary mr-2'
                                onClick={() => setDetailMode(true)}
                            >
                                Cancel
                            </button>
                            <button
                                type='button'
                                className='btn btn-primary ml-2'
                                data-dismiss='modal'
                                onClick={() => submitEditProduct()}
                            >
                                Submit
                            </button>
                        </div>
                    )
                }
            />
            <ModalComp
                modal_id={'add_product'}
                size='modal-lg'
                scrollable={true}
                title={'Add Product'}
                body={renderAddProduct()}
                footer={
                    <div className='mx-auto'>
                        <button type='button' className='btn btn-primary mr-2' data-dismiss='modal'>
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => submitAddProduct()}
                            disabled={
                                !dataAddProduct.name ||
                                !dataAddProduct.regular_price ||
                                !dataAddProduct.sale_price ||
                                !dataAddProduct.stock ||
                                !dataAddProduct.weight ||
                                addImage.length === 0 ||
                                checkboxCategory.filter((item) => item.isChecked === true)
                                    .length === 0 ||
                                checkboxTag.filter((item) => item.isChecked === true).length === 0
                            }
                        >
                            Submit
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id={'delete_product'}
                size='modal-lg'
                title={'Delete Product'}
                body={`Are you sure to delete this product?`}
                footer={
                    <div className='mx-auto'>
                        <button type='button' className='btn btn-primary mr-2' data-dismiss='modal'>
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => dispatch(deleteProduct(deleteId, user_id))}
                        >
                            Submit
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id={'activation_product'}
                title={productStatus.status_id === 1 ? 'Show Product' : 'Hide Product'}
                body={
                    productStatus.status_id === 1 ? (
                        <p className='text-center'>Are you sure to show this product?</p>
                    ) : (
                        <p className='text-center'>Are you sure to hide this product?</p>
                    )
                }
                footer={
                    <div className='mx-auto'>
                        <button type='button' className='btn btn-primary mr-2' data-dismiss='modal'>
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() =>
                                productStatus.status_id
                                    ? dispatch(
                                          editProduct(
                                              { status_id: productStatus.status_id },
                                              productStatus.product_id,
                                              productStatus.store_id
                                          )
                                      )
                                    : null
                            }
                        >
                            Submit
                        </button>
                    </div>
                }
            />
            <ModalComp modal_id={'alert_message'} title='Error Message' body={alert} />
            <ModalComp
                modal_id={'view_product_review_2'}
                size='modal-lg'
                scrollable={true}
                title='Product Review'
                body={renderProductReview()}
            />
        </div>
    );
};

export default StoreProducts;
