import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
    background: #101720;
    height: 100vh; 
    width: 150px; 
    display: flex;
    flex-direction: column; 
    justify-content: flex-start;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 12;
    padding: 0.5rem 1rem;
`;

export const NavLink = styled(Link)`
    color: #808080;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 1rem;
    height: auto;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
    &:hover {
        color: #ffffff;
    }
    &.active {
        color: #A949F5;
    }
`;

export const Bars = styled(FaBars)`
    display: none;
    color: #808080;
    @media screen and (max-width: 768px) {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    width: 100%;
    flex-grow: 1;
    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export const LogoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    padding: 1rem;
    margin-top: auto;
`;

export const NavBtn = styled.nav`
    display: flex;
    align-items: center;
    margin-top: auto;
    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export const NavBtnLink = styled(Link)`
    border-radius: 4px;
    background: #808080;
    padding: 10px 22px;
    color: #000000;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    margin-left: 24px;
    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #808080;
    }
`;

