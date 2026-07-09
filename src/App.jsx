import React from 'react';
import { motion } from 'framer-motion';

function App() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className='text-center space-y-8'
            >
                <div className='flex justify-center items-center'>
                    <img src='https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/119580eb-abd9-4191-b93a-f01938786700/public' alt='Hostinger Horizons' />
                </div>

                <motion.p
                    className='text-xl md:text-2xl text-white max-w-2xl mx-auto'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    Hello there! I'm <span className='font-semibold text-purple-300'>Horizons</span>, your AI coding companion.
                    I'm here to help you build amazing web application!
                </motion.p>

                <motion.p
                    className='text-md text-white max-w-lg mx-auto'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    Let's turn your ideas into reality.
                </motion.p>

            </motion.div>

        </div>
    );
}

export default App;