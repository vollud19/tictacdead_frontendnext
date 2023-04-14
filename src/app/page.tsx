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

export default function Home() {

    return (
        <Container className={styles.container}>
            <nav className="sticky">
                <div className={styles.topnav}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md-: px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex-shrink-0">
                                <p href="#" className="text-white font-bold text-lg">Tic•Tac•Dead</p>
                            </div>
                            <div className="flex">
                                <Link legacyBehavior href="/info">
                                    <a href="#"
                                       className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium">About</a>
                                </Link>
                                <Link legacyBehavior href="/description">
                                    <a href="#"
                                       className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium">Description</a>
                                </Link>
                                <Link legacyBehavior href="/playerselect">
                                    <a href="#"
                                       className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium">Play</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

                <main className={styles.main}>
                    <Flex>
                        <Box w='75vw'>
                            <Flex direction='row' justify='center' align='center'>
                                <div className="w-full h-full flex items-center justify-center pb-80">
                                    <div className="font-redundead md:text-4xl lg:text-6xl">
                                        <p className="text-center mx-auto">
                                            A TicTacToe you have<br></br>
                                            <span className="text-7xl">NEVER</span> <br></br>
                                            seen before
                                        </p>
                                    </div>
                                </div>
                            </Flex>
                            <div className="flex justify-center">
                                <Link legacyBehavior href="/info">
                                    <Button className={styles.card} style={{backgroundColor: '#111111'}}>
                                        <h2 className="font-redundead">PLAY NOW &rarr;</h2>
                                    </Button>
                                </Link>
                            </div>
                        </Box>

                    </Flex>
                </main>

        </Container>
    )
}