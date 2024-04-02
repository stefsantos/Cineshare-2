import React, { useEffect, useState } from 'react';
import './about_page.css';

function AboutPage() {

    const packages = [
        { type: 'NPM Package', name: 'Nodemon' },
        { type: 'NPM Package', name: 'Npm' },
        { type: 'NPM Package', name: 'Vite' },
        { type: 'NPM Package', name: 'Multer' },
        { type: 'Third-Party Library', name: 'React-Router-Dom' },
        { type: 'Third-Party Library', name: 'React-Icons' },
        { type: 'Third-Party Library', name: 'Express' },
        { type: 'Third-Party Library', name: 'dotenv' },
        { type: 'Third-Party Library', name: 'cors' },
        { type: 'Third-Party Library', name: 'dotenv' },
        { type: 'Third-Party Library', name: 'Mongoose' },
        { type: 'Third-Party Library', name: 'Json Web Token' },
        { type: 'Third-Party Library', name: 'BcryptJS' },
    ];

    return (
       <div className="about-page-container">
            <div className="about-header">
                Packages and Third-Party Libraries Used
            </div>

            <div className="packages-container">
                {packages.map((packge, index) => (
                    <div className="package" key={index}>
                        <div className='package-label'>{packge.type}</div>
                        {packge.name}
                    </div>
                ))}
            </div>
        </div>
    );

}

export default AboutPage;
