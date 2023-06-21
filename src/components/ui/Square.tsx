/*
    Author: Lucas Vollmann-Oswald
    TICTACDEAD
 */

// (was thought at first for the game buttons)
import React from 'react'

const Square = ({value}: any) => {
    return (
        <button className="square">
            {value}
        </button>
    )
}

export default Square;