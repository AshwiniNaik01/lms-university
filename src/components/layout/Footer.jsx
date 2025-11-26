
const Footer = () => {
    // Yahan se marginTop hata diya gaya hai
    return (
        <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#ecf0f1' }}>
            {/* <p>&copy; {new Date().getFullYear()} Code Drift's Platform. All rights reserved.</p> */}
            <p>&copy; {new Date().getFullYear()} AZA Technology Services LMS. All rights reserved.</p>
        </footer>
    );
};

export default Footer;