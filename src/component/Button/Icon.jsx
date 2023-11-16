import React, { useState, useEffect } from 'react';
import mystery from '../images/mystery.png';
import refresh from '../images/refresh-ccw.png';
import images from '../images/imagesmode.png';
import description from '../images/description.png';
import "../../component/FrontPage.css";
import supabase from '../../config/supabase';

const Icon = ({ article, article_id,onDataUpdate  }) => {
    const [activeIcons, setActiveIcons] = useState({
        proof: false,
        update: false,
        image: false,
        note: false,
        seo: false,
    });

    useEffect(() => {
        // Set active icons based on the data from the article
        if (article && article.control) {
            setActiveIcons({
                proof: article.control.proof,
                update: article.control.update,
                image: article.control.image,
                note: article.control.note,
                seo: article.control.seo,
            });
        }
    }, [article]);


    const handleSubmit = async () => {
        

        try {
            // Use the `articleId` from the route to identify the article to update
            const { data, error } = await supabase
                .from('articles')
                .update({ "control": article_id })
                .eq('article_id', article_id)


            if (error) {
                console.error('data', data);
                // Handle error as needed (e.g., show an error message to the user)
                return error.message;
            } else {
                onDataUpdate();
                console.log('done')
            }
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    const handleIconClick = async (iconType) => {
        // Update the local state
        setActiveIcons((prevIcons) => ({
            ...prevIcons,
            [iconType]: !prevIcons[iconType],
        }));

        // Update Supabase database immediately
        try {
            const { data, error } = await supabase
                .from('control')
                .upsert(
                    [{ article_id: article_id, [iconType]: !activeIcons[iconType] }],
                    { onConflict: ['article_id'] }
                );
            handleSubmit()
            if (error) {
                console.error('Error updating Supabase:', error);
            } else {
                console.log('Supabase update successful:', data);
            }
        } catch (error) {
            console.error('Error updating Supabase:', error.message);
        }
    };

    return (
        <div className="icons-flex">
            <img
                className={activeIcons.proof ? 'icon active' : 'icon'}
                src={mystery}
                alt=""
                onClick={() => handleIconClick('proof')}
            />
            <img
                className={activeIcons.update ? 'icon active' : 'icon'}
                src={refresh}
                alt=""
                onClick={() => handleIconClick('update')}
            />
            <img
                className={activeIcons.image ? 'icon active' : 'icon'}
                src={images}
                alt=""
                onClick={() => handleIconClick('image')}
            />
            <img
                className={activeIcons.note ? 'icon active' : 'icon'}
                src={description}
                alt=""
                onClick={() => handleIconClick('note')}
            />

            <p className={`icon ${activeIcons.seo ? 'active' : ''}`} onClick={() => handleIconClick('seo')}>
                SEO {activeIcons.seo != null}
            </p>
        </div>
    );
};

export default Icon;



// 
