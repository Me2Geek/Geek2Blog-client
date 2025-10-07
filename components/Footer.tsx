import React from "react";

const Footer: React.FC = () => {
    const githubUrl: string = "https://github.com/Me2Geek/Geek2Blog-client";

    const handleClick = (): void => {
        window.open(githubUrl, "_blank");
    };

    return (
        <footer className="bg-background text-muted-foreground py-6 text-center border-t border-border">
            <p className="text-sm">
                基于
                <span
                    className="text-primary underline cursor-pointer mx-1 hover:text-primary/80"
                    onClick={handleClick}
                >
          Geek2Blog
        </span>
                搭建
            </p>
        </footer>
    );
};

export default Footer;