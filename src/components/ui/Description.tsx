import React from 'react'
import Laptop from '../../assets/laptop.jpg'
import thinking2 from '../../../public/design-thinking.png'
import {router} from "next/client";
import {useRouter} from "next/navigation";

const Description = () => {
    const router = useRouter();

    return (
        <div id="description" className='w-full bg-white py-16 px-4'>
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-2 gap-4'>
                <img className='w-[400px] mx-auto my-4' src='/TicTacDeadExample.svg' alt='/'/>
                <div className='flex flex-col justify-center'>
                    <p className='text-yellow-700 font-bold '>Description</p>
                    <h1 className='md:text-4xl sm:text-3xl text-2xl font-bold py-2'>What is TicTacDead?</h1>
                    <p>
                        TicTacDead is based on Quibic. <br/>Qubic is a board game for two players. It is an extension of
                        Connect Four or Tic-Tac-Toe to four dimensions.

                        The object of the game is to arrange four checkers in a 4x4x4 cube on a straight
                        line. <br/><br/>A row can be vertical, horizontal or diagonal. The diagonals have surface and
                        space diagonals. Due to the four-dimensionality, several diagonals are always possible, so you
                        have to play very carefully in order not to miss one!
                    </p>
                    <button onClick={() => router.push("/playerselect")}
                            className='bg-black text-yellow-700 w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3'>Play
                        Now
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Description
