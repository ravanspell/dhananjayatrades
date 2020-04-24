/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
// import logo from "../logo.png";

function Navigation() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home">Dhananjaya Trades</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">
            <i className="fa fa-area-chart">
              <span className="ml-1">Dashboard</span>
            </i>
          </Nav.Link>
          <Nav.Link as={Link} to="/">
            <i className="fa fa-edit">
              <span className="ml-1">All Stocks</span>
            </i>
          </Nav.Link>
          <Nav.Link as={Link} to="/order">
            <i className="fa fa-shopping-cart">
              <span className="ml-1">Order</span>
            </i>
          </Nav.Link>
          <Nav.Link as={Link} to="/save/item">
            <i className="fa fa-save">
              <span className="ml-1">Save Item</span>
            </i>
          </Nav.Link>
          <Nav.Link>
            <i className="fa fa-share">
              <span className="ml-1">Returns</span>
            </i>
          </Nav.Link>
          <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

//<img src="/docs/4.0/assets/brand/bootstrap-solid.svg" width="30" height="30" alt="">
export default Navigation;
