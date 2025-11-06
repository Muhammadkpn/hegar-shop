// react js
import React, { Component } from "react";
// next js library
import Router from "next/router";

export default class _error extends Component {
  componentDidMount = () => {
    Router.push("/404");
  };

  render() {
    return <div />;
  }
}
