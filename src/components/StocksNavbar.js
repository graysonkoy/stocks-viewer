import React, { useState, useEffect } from "react";
import { Link as RouteLink, useLocation } from "react-router-dom"
import {
    Container,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap';

import { IsLoggedIn } from "../api/api"

function NavbarUser(props) {
    let [loggedIn, setLoggedIn] = useState(IsLoggedIn());
    let location = useLocation();

    // Check login status every time the page changes
    useEffect(() => {
        setLoggedIn(IsLoggedIn());
    }, [location]);
    
    if (!loggedIn) {
        return (
            <Container>
                <NavItem>
                    <NavLink tag={RouteLink} exact to="/register">Register</NavLink>
                </NavItem>

                <NavItem>
                    <NavLink tag={RouteLink} exact to="/login">Login</NavLink>
                </NavItem>
            </Container>
        )
    } else {
        return (
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>User</DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem>
                        <NavLink tag={RouteLink} exact to="/logout">Log out</NavLink>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        )
    }
}

export function StocksNavbar(props) {
    const [navbarOpen, setNavbarOpen] = useState(false);
  
    const toggle = () => setNavbarOpen(!navbarOpen);
  
    return (    
        <Navbar color="light" light expand="md">
            <NavbarBrand tag={RouteLink} exact to="/">Stocks Viewer</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={navbarOpen} navbar>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink tag={RouteLink} exact to="/">Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={RouteLink} exact to="/stocks">Stocks</NavLink>
                    </NavItem>

                    <NavbarUser/>
                </Nav>
            </Collapse>
        </Navbar>
    )
}