import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bottom-5 left-5 w-full bg-white py-2 flex flex-col justify-center items-center">
      <ul className="rule">
        <li>*Republishing or repurposing any and all assets on this page is strictly forbidden.</li>
      </ul>
      <ul className="copyRight">
        <li>©MathLearn Inc.</li>
      </ul>
    </footer>
  );  
};

export default Footer;
