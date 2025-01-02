"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import { Briefcase, Codepen, Dribbble, Facebook, GraduationCap, Instagram, Languages, SquareUser, Twitter } from 'lucide-react';
import React, { useState } from 'react';

const AboutPage: React.FC = () => {
    const [showProductView, setShowProductView] = useState(0);

    return (
        <div className="flex items-center justify-center gap-10 w-full mt-24 my-8 mx-auto h-auto z-50">
            <div className='w-2/5 h-[379px] flex items-center justify-center'>
                {showProductView === 0 && (
                    <div className='flex gap-3 flex-col rounded-xl bg-white p-6'>
                        <p className='text-2xl font-bold'>About Me</p>
                        <Separator className='mb-2' />
                        <p className='text-base text-justify'>Front-End developer with a passion for creating dynamic and user-friendly websites. Seeking for challenging projects to boost my professional growth.</p>
                    </div>
                )}
                {showProductView === 1 && (
                    <div className='flex gap-3 flex-col rounded-xl bg-white p-6'>
                        <p className='text-2xl font-bold'>Experience</p>
                        <Separator className='mb-2' />
                        <p className='text-lg'>Veza S.R.L - React Front-End Developer <br /> <span className='font-light text-sm'>(Jan, 2023 - Nov, 2024)</span></p>
                        <Separator className='mb-2' />
                        <p className='text-base text-justify'>I have been developing a sales, storage and pricing control and an events web applications with React and its mobile versions with React Native. For the graphical interface part we use Material Ui, Ant-Desing and Bootstrap resources. We organize projects with Jira and Bitbucket tools.</p>
                    </div>
                )}
                {showProductView === 2 && (
                    <div className='flex gap-3 w-full flex-col rounded-xl bg-white p-6 px-4'>
                        <p className='text-2xl font-bold'>Education</p>
                        <Separator className='mb-2' />
                        <Accordion type="single" className="w-full gap-0">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className='py-1 font-bold'><div className='flex w-full justify-between items-center'>UTN FRRe | Tecnicatura Universitaria en Programación <span className='text-light text-xs text-right'>(2022 - present)</span></div></AccordionTrigger>
                                <AccordionContent className='py-1'>
                                    Student in programming technical degree, and have successfully completed 20 out of 21 subjects in the program.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className='py-1 font-bold'><div className='flex w-full justify-between items-center'>Informatorio | Web Development (Django - Python) <span className='text-light text-xs text-right'>2023 (240 hr.)</span></div></AccordionTrigger>
                                <AccordionContent className='py-1'>
                                    I worked in a team developing a web application that included registration, login, posts and comments using Git, Python and Django.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className='py-1 font-bold'><div className='flex w-full justify-between items-center'>Codo a Codo | Full Stack (JS - Node) <span className='text-light text-xs text-right'>2023 (208 hr.) </span></div></AccordionTrigger>
                                <AccordionContent className='py-1'>
                                    I enhanced my understanding of web development with HTML, CSS and JS. Additionally, I gained insight into backend development using Node.js
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className='py-1 font-bold'><div className='flex w-full justify-between items-center'>Codo a Codo | Data Science (Python-Excel-Power Bi) <span className='text-light text-xs text-right'>2023</span></div></AccordionTrigger>
                                <AccordionContent className='py-1'>
                                    It consisted of a self-managed course divided into three segments: In the first part, we learned data manipulation using Python, in the second part, the use of dynamix Excel tables, and in the third part, the fundamentals of utilizing Power Bi.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger className='py-1 font-bold'><div className='flex w-full justify-between items-center'>Argentina Programa/UNaM | Curso de desarrollo de
                                    aplicaciones en Android (Python-Kivy) <span className='text-light text-xs text-right'>2023</span></div></AccordionTrigger>
                                <AccordionContent className='py-1'>
                                    It also consisted of a course developed in three segments: In the first one, we learned the basics of programming, in the second, the fundamentals of the Python language, and in the third, we developed a mobile application for Android using Kivy technology.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger className='py-1 font-bold'><div className='flex w-full justify-between items-center'>Coderhouse | React JS <span className='text-light text-xs text-right'>2023 (30 hr.)</span></div></AccordionTrigger>
                                <AccordionContent className='py-1'>
                                    I learned the use of React, its hooks and we made an e-commerce application
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger className='py-1 font-bold'><div className='flex w-full justify-between items-center'>iEN | Introduction to JS language <span className='text-light text-xs text-right'>2022 (48 hr.)</span></div></AccordionTrigger>
                                <AccordionContent className='py-1'>
                                    I improved my knowledge of the javascript language and programming fundamentals, such as handling events, promises, asynchrony, and requests.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-8">
                                <AccordionTrigger className='py-1 font-bold'><div className='flex w-full justify-between items-center'>iEN | Desarrollo Web (HTML-CSS-JS) <span className='text-light text-xs text-right'>2021 (48 hr.)
                                </span></div></AccordionTrigger>
                                <AccordionContent className='py-1'>
                                    I have learned the basics of web development with its main technologies: HTML, CSS and JS. As a final project I presented an application that brought together all the knowledge
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}
                {showProductView === 3 && (
                    <div className='flex gap-3 flex-col rounded-xl bg-white p-6'>
                        <p className='text-lg font-bold'>Skills:<br /> <span className='font-light text-sm'>React, Node, Django, Bitbucket, React Native, Python, Typescript, Jira, Git, Material UI, Ant-design, Shadcn, Tailwind, Kivy </span></p>
                        <Separator className='mb-2' />
                        <div className='text-md'><span className='text-lg font-bold'>Languages:</span>
                            <div className='flex items-between flex-col w-full mt-2'>
                                <p>English: <span className='font-light text-sm pl-6 text-center'>Intermediate</span></p>
                                <p>Spanish: <span className='font-light text-sm pl-5 text-center'>Native</span></p>
                                <p>Italian: <span className='font-light text-sm pl-8 text-center'>Basic</span></p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
            <div
                className="relative flex justify-center items-center h-[379px] w-[300px] rounded-lg bg-black shadow-[0px_70px_63px_-60px_#000000] transition-all duration-700 overflow-hidden group">
                <div
                    className="absolute inset-0 bg-cover transition-all duration-1000 group-hover:ml-[30%] group-hover:scale-125"
                    style={{
                        backgroundImage: `url('joaquin_cleva.png')`,
                        filter: "grayscale(80%)",

                    }}
                />
                <div className="absolute -top-[10%] -left-[100%] w-[25%] h-[75rem] -rotate-[45deg]  bg-gray-300 transition-all duration-300 opacity-15 z-[50] group-hover:brightness-50 group-hover:translate-x-[800%] group-hover:-translate-y-[50%]"></div>
                <div className="absolute z-50 h-[369px] w-[290px] group-hover:border group-hover:border-white rounded-lg bg-transparent transition-all duration-300 " />
                <h2 className="absolute top-4 left-4 text-white inset-0 font-sans text-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-50 group-hover:shadow-[0_0_0_1px_rgba(250, 250, 250, 0.1)] ">
                    Joaquín Cleva
                </h2>
                <div className="absolute z-50 left-4 flex gap-4 flex-col items-center justify-around w-12 top-[60%] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 ">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SquareUser onClick={() => { setShowProductView(0) }} className="cursor-pointer w-4 h-4 text-white hover:text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent side='left' className='bg-white text-black z-[55]'>
                                <p>About me</p>
                                <TooltipArrow fill='#fff' />
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Briefcase onClick={() => { setShowProductView(1) }} className="cursor-pointer w-4 h-4 text-white hover:text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent side='left' className='bg-white text-black z-[55]'>
                                <p>Experience</p>
                                <TooltipArrow fill='#fff' />
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <GraduationCap onClick={() => { setShowProductView(2) }} className="cursor-pointer w-4 h-4 text-white hover:text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent side='left' className='bg-white text-black z-[55]'>
                                <p>Education</p>
                                <TooltipArrow fill='#fff' />
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Languages onClick={() => { setShowProductView(3) }} className="cursor-pointer w-4 h-4 text-white hover:text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent side='left' className='bg-white text-black z-[55]'>
                                <p>Skills</p>
                                <TooltipArrow fill='#fff' />
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;