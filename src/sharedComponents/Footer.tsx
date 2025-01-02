import { Facebook, Github, Globe, Instagram, Linkedin, Mail, MapPin, Search, Twitter } from "lucide-react";
import CodewarsLogo from "./CodewarsLogo";

const Footer = () => {
    return <footer className=" text-white py-6 w-full z-[60]" >
        <div className="flex justify-center space-x-6 mb-4">
            <a href="https://www.linkedin.com/in/joaqu%C3%ADn-cleva-845657265/"
                aria-label="Linkedin" className="hover:text-gray-400 hover:border-gray-400 border-2 rounded-full p-1.5">
                <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/joaquincleva"
                aria-label="Github" className="hover:text-gray-400 hover:border-gray-400 border-2 rounded-full p-1.5">
                <Github className="w-5 h-5" />
            </a>
            <a href="https://www.codewars.com/users/joaquincleva"
                aria-label="Codewars" className="hover:text-gray-400 hover:border-gray-400 border-2 rounded-full p-1.5 group">
                <CodewarsLogo width="1.25rem" height="1.25rem" />
            </a>
            <a href="https://maps.app.goo.gl/Fw9dZUn69nsPmUDg9"
                aria-label="Location" className="hover:text-gray-400 hover:border-gray-400 border-2 rounded-full p-1.5">
                <MapPin className="w-5 h-5" />
            </a>
            <a href="mailto:joaquin.cleva@gmail.com"
                aria-label="Gmail" className="hover:text-gray-400 hover:border-gray-400 border-2 rounded-full p-1.5">
                <Mail className="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/jcleva"
                aria-label="Facebook" className="hover:text-gray-400 hover:border-gray-400 border-2 rounded-full p-1.5">
                <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/jcleva2/"
                aria-label="Instagram" className="hover:text-gray-400 hover:border-gray-400 border-2 rounded-full p-1.5">
                <Instagram className="w-5 h-5" />
            </a>
        </div>
        <div className="text-center text-sm">
            © 2024 Copyright
            <a href="https://clevatech.com" className="pl-2 text-gray-400 hover:underline">
                ClevaTech.com
            </a>
        </div>
    </footer>
}

export default Footer;