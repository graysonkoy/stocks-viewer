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
    DropdownItem
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
            <React.Fragment>
                <NavItem>
                    <NavLink tag={RouteLink} to="/register">Register</NavLink>
                </NavItem>

                <NavItem>
                    <NavLink tag={RouteLink} to="/login">Login</NavLink>
                </NavItem>
            </React.Fragment>
        )
    } else {
        return (
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>User</DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem>
                        <NavLink tag={RouteLink} to="/logout">Log out</NavLink>
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
        <Navbar color="transparent" light expand="md">
            <NavbarBrand tag={RouteLink} to="/">Stocks Viewer</NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={navbarOpen} navbar>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink tag={RouteLink} to="/">Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink tag={RouteLink} to="/stocks">Stocks</NavLink>
                    </NavItem>

                    <NavbarUser/>
                </Nav>
            </Collapse>
        </Navbar>
    )
}