"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import {
    Briefcase,
    GraduationCap,
    Languages,
    SquareUser,
} from 'lucide-react';
import React, { useState } from 'react';

const contentData = [
    {
        title: 'About Me',
        content: (
            <p className="text-base text-justify">
                Front-End developer with a passion for creating dynamic and user-friendly websites. Seeking for challenging projects to boost my professional growth.
            </p>
        ),
    },
    {
        title: 'Experience',
        content: (
            <>
                <p className="text-lg">
                    Veza S.R.L - React Front-End Developer <br />
                    <span className="font-light text-sm">(Jan, 2023 - Nov, 2024)</span>
                </p>
                <Separator className="mb-2" />
                <p className="text-base text-justify">
                    I have been developing a sales, storage and pricing control and an events web applications with React and its mobile versions with React Native. For the graphical interface part we use Material Ui, Ant-Desing and Bootstrap resources. We organize projects with Jira and Bitbucket tools.
                </p>
            </>
        ),
    },
    {
        title: 'Education',
        content: (
            <Accordion type="single" className="w-full gap-0">
                {[
                    {
                        label: 'UTN FRRe | Tecnicatura Universitaria en Programación',
                        date: '(2022 - present)',
                        description: 'Student in programming technical degree, and have successfully completed 20 out of 21 subjects in the program.',
                    },
                    {
                        label: 'Informatorio | Web Development (Django - Python)',
                        date: '2023 (240 hr.)',
                        description: 'I worked in a team developing a web application that included registration, login, posts and comments using Git, Python and Django.',
                    },
                    {
                        label: 'Codo a Codo | Full Stack (JS - Node)',
                        date: '2023 (208 hr.)',
                        description: 'I enhanced my understanding of web development with HTML, CSS and JS. Additionally, I gained insight into backend development using Node.js',
                    },
                    {
                        label: 'Codo a Codo | Data Science (Python-Excel-Power Bi)',
                        date: '2023',
                        description: 'It consisted of a self-managed course divided into three segments: In the first part, we learned data manipulation using Python, in the second part, the use of dynamic Excel tables, and in the third part, the fundamentals of utilizing Power Bi.',
                    },
                    {
                        label: 'Argentina Programa/UNaM | Curso de desarrollo de aplicaciones en Android (Python-Kivy)',
                        date: '2023',
                        description: 'The course consisted of three segments: In the first one, we learned the basics of programming, in the second, the fundamentals of the Python language, and in the third, we developed a mobile application for Android using Kivy technology.',
                    },
                    {
                        label: 'Coderhouse | React JS',
                        date: '2023 (30 hr.)',
                        description: 'I learned the use of React, its hooks, and created an e-commerce application.',
                    },
                    {
                        label: 'iEN | Introduction to JS language',
                        date: '2022 (48 hr.)',
                        description: 'I improved my knowledge of the JavaScript language and programming fundamentals, such as handling events, promises, asynchrony, and requests.',
                    },
                    {
                        label: 'iEN | Desarrollo Web (HTML-CSS-JS)',
                        date: '2021 (48 hr.)',
                        description: 'I have learned the basics of web development with its main technologies: HTML, CSS, and JS. As a final project, I presented an application that brought together all the knowledge.',
                    }
                ].map((item, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                        <AccordionTrigger className="py-1 font-bold">
                            <div className="w-full flex justify-between items-center">
                                {item.label} <span className="text-light text-xs text-right">{item.date}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="py-1">{item.description}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        ),
    },
    {
        title: 'Skills & Languages',
        content: (
            <>
                <p className="text-lg font-bold">
                    Skills:<br />
                    <span className="font-light text-sm">React, Node, Django, Bitbucket, React Native, Python, Typescript, Jira, Git, Material UI, Ant-design, Shadcn, Tailwind, Kivy</span>
                </p>
                <Separator className="mb-2" />
                <div className="text-md">
                    <span className="text-lg font-bold">Languages:</span>
                    <div className="flex flex-col mt-2">
                        {[
                            { lang: 'English', level: 'Intermediate' },
                            { lang: 'Spanish', level: 'Native' },
                            { lang: 'Italian', level: 'Basic' },
                        ].map((item, i) => (
                            <p key={i}>
                                {item.lang}:{' '}
                                <span className="font-light text-sm pl-6">{item.level}</span>
                            </p>
                        ))}
                    </div>
                </div>
            </>
        ),
    },
];

const icons = [SquareUser, Briefcase, GraduationCap, Languages];

const AboutPage: React.FC = () => {
    const [showProductView, setShowProductView] = useState(0);

    return (
        <div className="flex items-center justify-center gap-10 w-full mt-24 my-8 mx-auto h-auto z-50">
            <div className="w-2/5 h-[379px] flex items-center justify-center">
                <div className="flex gap-3 w-full flex-col rounded-xl bg-white p-6 px-4">
                    <p className="text-2xl font-bold">{contentData[showProductView].title}</p>
                    <Separator className="mb-2" />
                    {contentData[showProductView].content}
                </div>
            </div>
            <div className="relative flex justify-center items-center h-[379px] w-[300px] rounded-lg bg-black shadow-[0px_70px_63px_-60px_#000000] transition-all duration-700 overflow-hidden group">
                <div
                    className="absolute inset-0 bg-cover transition-all duration-1000 group-hover:ml-[30%] group-hover:scale-125"
                    style={{
                        backgroundImage: `url('joaquin_cleva.png')`,
                        filter: 'grayscale(80%)',
                    }}
                />
                <div className="absolute -top-[10%] -left-[100%] w-[25%] h-[75rem] -rotate-[45deg] bg-gray-300 transition-all duration-300 opacity-15 z-[50] group-hover:brightness-50 group-hover:translate-x-[800%] group-hover:-translate-y-[50%]" />
                <div className="absolute z-50 h-[369px] w-[290px] group-hover:border group-hover:border-white rounded-lg bg-transparent transition-all duration-300" />
                <h2 className="absolute top-4 left-4 text-white inset-0 font-sans text-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-50 group-hover:shadow-[0_0_0_1px_rgba(250, 250, 250, 0.1)]">
                    Joaquín Cleva
                </h2>
                <div className="absolute z-50 left-4 flex gap-4 flex-col items-center justify-around w-12 top-[60%] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {icons.map((Icon, i) => (
                        <TooltipProvider key={i}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Icon
                                        onClick={() => setShowProductView(i)}
                                        className="cursor-pointer w-4 h-4 text-white hover:text-gray-400"
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="left" className="bg-white text-black z-[55]">
                                    <p>{contentData[i].title}</p>
                                    <TooltipArrow fill="#fff" />
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
