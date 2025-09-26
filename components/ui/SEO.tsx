import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  name?: string; // For twitter:creator
  type?: string; // For og:type
}

const SEO: React.FC<SEOProps> = ({ title, description, name, type }) => {
  useEffect(() => {
    document.title = title;

    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
        let element = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attr, key);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    if (description) {
        setMetaTag('name', 'description', description);
        setMetaTag('property', 'og:description', description);
        setMetaTag('name', 'twitter:description', description);
    }
    if (title) {
        setMetaTag('property', 'og:title', title);
        setMetaTag('name', 'twitter:title', title);
    }
    if (name) {
        setMetaTag('name', 'twitter:creator', name);
    }
    if (type) {
        setMetaTag('property', 'og:type', type);
    }
    
  }, [title, description, name, type]);

  return null;
};

export default SEO;
