"use client"
import {Inter} from 'next/font/google'
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    CloseButton,
    Container,
    Flex,
    Image,
    Input,
    Text
} from "@chakra-ui/react";
import Link from "next/link"

import styles from './styles/Home.module.css'
import WebFont from 'webfontloader'
import bloodhand from '../../public/bloodhand.svg'
import {ReactNode, useEffect} from "react";
import Navbar from '../components/ui/Navbar'
import Hero from '../components/ui/Hero'
import Description from "@/components/ui/Description";
import About from "../components/ui/About"
import Footer from "@/components/ui/Footer";

export default function Home() {

    return (
        <div>
            <Navbar></Navbar>
            <Hero></Hero>
            <Description></Description>
            <About></About>
            <Footer></Footer>
        </div>
    )
}