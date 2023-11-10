import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { filterArticles, filterPublicationsByUserEmail, formatDate, countArticlesByStatus,countWord, filterArticlesCount } from './filter.js';
import './FrontPage.css'

import arrowDown from './images/arrow-down.png'
import setting from './images/settings.png'
import plus from './images/plus.png'
import eye from './images/eye.png'
import key from './images/key.svg'
import trash from './images/trash-2.png'
import chit from './images/chit.svg'

import try3 from './images/try.png'
import mystery from './images/mystery.png'
import refresh from './images/refresh-ccw.png'
import images from './images/imagesmode.png'
import description from './images/description.png'
import PostTypeButton from './Button/PostTypeButton';
import ArticleSearch from './Button/ArticleSearch';

import ConfirmDeletePopup from './Button/ConfirmDeletePopup.jsx';



function FrontPage() {

    const navigate = useNavigate()
    const [articles, setArticles] = useState([]);
    const [publications, setPublications] = useState([]);

    const [selectedPublication, setSelectedPublication] = useState('');
    const [finalData, setFinalData] = useState([])
    const [selectedPostTypeId, setSelectedPostTypeId] = useState(2);
    const [selectedPublicationId, setSelectedPublicationId] = useState(1);
    const [selectedStatusId, setSelectedStatusId] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState(finalData.map(() => true));
    const [sortBy, setSortBy] = useState({ attribute: '', ascending: true });
    const [category, setCategory] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState([])
    const [sortedArticlesLength, setsortedArticlesLength] = useState(0)
    





    async function fetchArticles() {

        let { data, error } = await supabase
            .from('articles')
            .select(`
        *,
        articlestatus(*),
        authors(*),
        categories(*),
        post_type(*),
        publication(*),
       control("*")
        `)
        if (error) {
            console.error('Error fetching articles:', error.message);
        } else {

            setArticles(data);
         
        }
    }

   



    useEffect(() => {


        fetchArticles()
       


        async function fetchPublications() {
            try {
                const { data, error } = await supabase.from('user_publication').select(`
              *,
              user(*),
              publication(*)`
                );
                if (error) {
                    throw error;
                }

                let tokenInfo = localStorage.getItem("sb-czlpeqcpksfalvtmrulq-auth-token")
                const jsonObject = JSON.parse(tokenInfo);
                let email = jsonObject.user.email
                let filterData = filterPublicationsByUserEmail(data, email)
                if (filterData.length === 0) {
                    navigate("/blank");
                }

                setPublications(filterData);
            } catch (error) {
                console.error('Error fetching publications:', error.message);
            }
        }

        fetchArticles();

        fetchPublications();
    }, [navigate]);


    // Use the filtering function to get filtered articles based on selectedPublicationId and selectedPostTypeId
    useEffect(() => {
        const filteredArticles = filterArticles(articles, selectedPublicationId, selectedPostTypeId, selectedStatusId)
        const uniqueCategories = new Set();

        const categoriesData = filteredArticles.map(article => {
            const { name, url } = article.categories;

            // Use the 'url' as a unique key to avoid duplicates
            if (!uniqueCategories.has(url)) {
                uniqueCategories.add(url);
                return { name, url };
            }

            return null; // Skip duplicates
        }).filter(category => category !== null);
        setFinalData(filteredArticles)
        setCategory(categoriesData)
    }, [articles, selectedPublicationId, selectedPostTypeId, selectedStatusId])


    const toggleSortBy = (attribute) => {
        if (sortBy.attribute === attribute) {
            setSortBy({ attribute, ascending: !sortBy.ascending });
        } else {
            setSortBy({ attribute, ascending: true });
        }
    };



    const handlePublicationChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedPublication(selectedValue);

        const selectedPublicationObject = publications.find(
            (publication) => publication?.publication_name === selectedValue
        );

        if (selectedPublicationObject) {
            const publicationId = selectedPublicationObject?.publication_id;
            setSelectedPublicationId(publicationId);
        }
    };

    const handleButtonClick = (value, option) => {
        setSelectedPostTypeId(value);

    };

    const singleItemCheckbox = (article_id) => {
        // Parse the article_id to an integer
        const articleIdAsInt = parseInt(article_id, 10);

        // Create a copy of the current checkboxStates
        const newCheckboxStates = { ...checkboxStates };

        // Toggle the checked state for the specified article_id
        newCheckboxStates[articleIdAsInt] = !newCheckboxStates[articleIdAsInt];

        // Create an array of selected article_ids based on the updated checkbox states
        const ArticleIds = Object.keys(newCheckboxStates).filter(
            (id) => newCheckboxStates[id]
        ).map(id => parseInt(id, 10)); // Parse the IDs to integers in the resulting array

        // Now, ArticleIds contains the article_ids as integers of the  items


        setIdToDelete(ArticleIds);



        // Update the checkboxStates
        setCheckboxStates(newCheckboxStates);
    };




    // Event handler to capture the selected category
    const handleCategoryChange = (e) => {
        const selectedValue = e.target.value;

        setSelectedCategory(selectedValue);
    };




    const handleSearch = (query) => {
        // Use the query to filter the articles
        const searching = articles.filter((article) =>
            new RegExp(`\\b${query}`, 'i').test(article.title)
        );

        setFinalData(searching)
    };



    const forCount = filterArticlesCount(articles, selectedPublicationId, selectedPostTypeId)

    //calling count function to count status count of articles 
    let count = countArticlesByStatus(forCount)


    const toggleCheckbox = () => {
        const newIsChecked = !isChecked;
        setIsChecked(newIsChecked);

        // Create an array of new checkbox states based on the updated isChecked value
        const newCheckboxStates = finalData.reduce((checkboxStates, article) => {
            checkboxStates[article.article_id] = newIsChecked;
            return checkboxStates;
        }, {});


        let value = Object.keys(newCheckboxStates)
        let ArticleIds = value.map((str) => parseInt(str, 10))



        if (idToDelete.length === sortedArticlesLength) {
            setIdToDelete([]);
        } else {

            setIdToDelete(ArticleIds);
        }


        setCheckboxStates(newCheckboxStates);
    }




    const sortingFunctions = [
        {
            key: 'title',
            sortFunction: (a, b, ascending) => ascending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title),
        },
        {
            key: 'seo_score',
            sortFunction: (b, a, ascending) => ascending ? b.seo_score - a.seo_score : b.seo_score - a.seo_score,
        },
        {
            key: 'date',
            sortFunction: (a, b, ascending) => ascending ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date),
        },
        {
            key: 'url',
            sortFunction: (a, b, ascending) => ascending ? a.url.localeCompare(b.url) : b.url.localeCompare(a.url),
        },
    ];

    const applySortingAndFilteringFunctions = (data, sortingFunctions, ascending, selectedCategoryUrl) => {
        let filteredData = data;

        // Filter based on the selectedCategoryUrl (if not "All")
        if (selectedCategoryUrl && selectedCategoryUrl !== "All") {
            filteredData = data.filter((item) => item.categories.url === selectedCategoryUrl);
        }

        // Apply sorting functions
        for (const { sortFunction } of sortingFunctions) {
            filteredData = filteredData.sort((a, b) => sortFunction(a, b, ascending));
        }

        return filteredData;
    };




    const sortedArticles = applySortingAndFilteringFunctions(finalData, sortingFunctions, sortBy.ascending, selectedCategory);

    useEffect(() => {
        setsortedArticlesLength(sortedArticles.length)
    }, [sortedArticles])





    const handleConfirm = async (articleId) => {
        try {
            // Update the 'Deleted' field to true for the selected articles
            const { error } = await supabase
                .from('articles')
                .update({ Deleted: true })
                .in('article_id', articleId);

            if (error) {
                throw error.message
            } else {
                fetchArticles()
                setIsChecked(false)
            }

        } catch (error) {
            console.error('Error deleting articles:', error.message);
        }


        setIsConfirmationOpen(false);
    };

    // Define the onClose function
    const handleClose = () => {
        // Close the confirmation popup
        setIsConfirmationOpen(false);
    };



    return (
        <>
            <div className="containers">

                <div className="selectors">
                    <div className="flex">
                        <div className="flex" >
                            <select
                                name=""
                                id=""
                                onChange={handlePublicationChange}
                                value={selectedPublication}
                            >
                                {publications.map((publication) => (
                                    <option key={publication.publication_id} value={publication.publication_name}>
                                        {publication.publication_name}
                                    </option>
                                ))}
                            </select>

                            <img src={arrowDown} alt="" style={{ marginRigth: '10px' }} />
                        </div >
                        <PostTypeButton onChangeValue={handleButtonClick} />
                    </div>
                    <div className="key setting">
                        <p>
                            Settings
                        </p>
                        <img src={setting} alt="" />
                    </div>
                </div>

                <div className="top-card">
                    <div className="buttons-others">
                        <p className={`all ${selectedStatusId === null ? 'all-button-selected' : ''}`} onClick={() => setSelectedStatusId(null)}>All ({count.all})</p>
                        <p className={`draft ${selectedStatusId === 1 ? 'draft-button-selected' : ''}`} onClick={() => setSelectedStatusId(1)}>Draft  ({count.draft})</p>
                        <p className={`review ${selectedStatusId === 2 ? 'review-button-selected' : ''}`} onClick={() => setSelectedStatusId(2)}>Review  ({count.review})</p>
                        <p className={`published ${selectedStatusId === 3 ? 'published-button-selected' : ''}`} onClick={() => setSelectedStatusId(3)}>Published  ({count.published})</p>
                        <p className={`deleted ${selectedStatusId === 0 ? 'deleted-button-selected' : ''}`} onClick={() => setSelectedStatusId(0)}>Deleted ({count.deleted}) </p>

                    </div>
                    <div className="flex">
                        <ArticleSearch articles={articles} onSearch={handleSearch} />
                        <div className="add-plus">
                            <Link className='link' to={`/addarticle/${selectedPublicationId}/${selectedPostTypeId}`}>
                                <p>Add a {selectedPostTypeId === 2 ? "Blog" : "Page"} </p>
                            </Link>
                            <img src={plus} alt="" />
                        </div>
                    </div>

                </div>
                <div className="filters-input">

                    <div className="key">
                        <div className="checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={toggleCheckbox}
                                />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <p>Select All</p>
                        <img
                            src={isChecked ? "checkmark.png" : "uncheck.png"}
                            alt=""
                            onClick={toggleCheckbox}
                        />
                        <img
                            src={trash}
                            alt="Click to open confirmation"
                            onClick={() => setIsConfirmationOpen(true)}
                        />

                        <ConfirmDeletePopup
                            isOpen={isConfirmationOpen}
                            articleId={idToDelete}
                            onConfirm={handleConfirm}
                            onClose={handleClose}

                        />
                    </div>

                    <div className="filters">
                        <div className="flex" onClick={() => toggleSortBy('title')}>
                            <p>Title</p>
                            <div className="arrows">

                                {sortBy.attribute === 'title' && sortBy.ascending ? (

                                    <svg style={{ marginBottom: '2px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                                        <path d="M0 6L6 0L12 6H0Z" fill="#457EFF" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                                        <path d="M0 0.203125L6 6.20312L12 0.203125H0Z" fill="#457EFF" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className="flex" onClick={() => toggleSortBy('seo_score')}>
                            <p>SEO Score</p>
                            <div className="arrows">
                                {/* Sorting icons (adjust the SVG path as needed) */}
                                {sortBy.attribute === 'seo_score' && sortBy.ascending ? (
                                    <svg style={{ marginBottom: '2px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                                        <path d="M0 6L6 0L12 6H0Z" fill="#457EFF" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                                        <path d="M0 0.203125L6 6.20312L12 0.203125H0Z" fill="#457EFF" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className="flex" onClick={() => toggleSortBy('date')}>
                            <p>Date</p>
                            <div className="arrows">
                                {/* Sorting icons (adjust the SVG path as needed) */}
                                {sortBy.attribute === 'date' && sortBy.ascending ? (
                                    <svg style={{ marginBottom: '2px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                                        <path d="M0 6L6 0L12 6H0Z" fill="#457EFF" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                                        <path d="M0 0.203125L6 6.20312L12 0.203125H0Z" fill="#457EFF" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className="flex" onClick={() => toggleSortBy('category')}>
                            <p>Category</p>
                            <div className="arrows">
                                {/* Sorting icons (adjust the SVG path as needed) */}
                                {sortBy.attribute === 'category' && sortBy.ascending ? (
                                    <svg style={{ marginBottom: '2px' }} xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                                        <path d="M0 6L6 0L12 6H0Z" fill="#457EFF" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                                        <path d="M0 0.203125L6 6.20312L12 0.203125H0Z" fill="#457EFF" />
                                    </svg>
                                )}
                            </div>
                        </div>


                        <div className="flex">
                            <select name="categoryDropdown" id="categoryDropdown" onChange={handleCategoryChange} value={selectedCategory} >
                                <option value="">All</option>
                                {category.map(category => (
                                    <option key={category.url} value={category.url}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <img src={arrowDown} alt="" style={{ marginRight: '10px;' }} />
                        </div>


                    </div>


                </div>

                {sortedArticles.map((article) => (
                    <div className="card" key={article.article_id}>
                        <div className="card-left">
                            <div className="checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={checkboxStates[article.article_id]}
                                        onChange={() => singleItemCheckbox(article.article_id)}
                                    />

                                    <span className="checkmark"></span>
                                </label>
                            </div>
                            {article.featured_image && <img src={!article.featured_image ? article.featured_image : try3} alt="" />}
                        </div>
                        <div className="card-right">
                            <div className="options">
                                <p className="heading">{article.title}</p>
                                <div className="flex">
                                    <div className="key">
                                        <p className="char char-red">({article.title.length} char)</p>
                                        <img src={eye} alt="" />
                                    </div>
                                    {article.seo_score && <div className="seo">
                                        <p>SEO</p>
                                        <p className="percent percent-red">{article.seo_score} %</p>
                                    </div>}
                                    <div className="seo edit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                            <path d="M12.776 1.33594C12.6055 1.33594 12.4347 1.40092 12.3047 1.53125L11.1667 2.66927L13.8333 5.33594L14.9714 4.19792C15.232 3.93725 15.232 3.51521 14.9714 3.25521L13.2474 1.53125C13.1171 1.40092 12.9466 1.33594 12.776 1.33594ZM10.1667 3.66927L2.5 11.3359V14.0026H5.16667L12.8333 6.33594L10.1667 3.66927Z" fill="#457EFF" />
                                        </svg>
                                        <Link className="svgLink" to={`/updatearticle/${article.article_id}`}>Edit</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="bread-crumb">
                                <div className="bread-crum">
                                    <img src={arrowDown} alt="" />
                                    <p className="crumb">/{article.categories.url}/<span>{article.url}</span></p>
                                    <p>{formatDate(article.date)}</p>
                                    <p>{formatDate(article.created_at)}</p>
                                    <p>ID {article.article_id}</p>
                                    <div className="icons-flex">
                                        <img class={article.control.proof ? "icon active" : "icon"} src={mystery} alt="" />
                                        <img class={article.control.update ? "icon active" : "icon"} src={refresh} alt="" />
                                        <img class={article.control.image ? "icon active" : "icon"} src={images} alt="" />
                                        <img class={article.control.note ? "icon active" : "icon"} src={description} alt="" />
                                        <p class={article.control.seo ? "icon active" : "icon"}>SEO</p>
                                    </div>
                                </div>

                                <div className="words">{countWord(article.body)} Words </div>
                            </div>
                            <div className="buttons-others flex">
                                {/* <button>{article.articlestatus.status_name}</button> */}
                                <button className={article.articlestatus.status_name === "Draft" ? "draft-select" : ""}>Draft</button>
                                <button className={article.articlestatus.status_name === "Review" ? "review-select" : ""} >Review</button>
                                <button className={article.articlestatus.status_name === "Published" ? "published-select" : ""}>Published</button>

                                {article.keyword && <div className="flex key">
                                    <img src={key} alt="" />
                                    <p>{article.keyword}</p>
                                </div>}
                                {article.tag && <div className="flex key">
                                    <img src={chit} alt="" />
                                    <p>{article.tag}</p>
                                </div>
                                }
                            </div>

                        </div>
                    </div>
                ))}
                {/* <div className="card">
                    <div className="card-left">
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked="checked" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <img src={try3} alt="" />
                    </div>
                    <div className="card-right">
                        <div className="options">
                            <p className="heading">Guide to Building a Brand Identity Kit: The Ultimate Beginner’s Guide for Establishing a Strong Brand</p>
                            <div className="flex">
                                <div className="key">
                                    <p className="char char-red">(107 Char)</p>
                                    <img src={eye} alt="" />
                                </div>

                                <div className="seo">
                                    <p>SEO</p>
                                    <p className="percent percent-red">50%</p>
                                </div>

                                <div className="seo edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                        <path d="M12.776 1.33594C12.6055 1.33594 12.4347 1.40092 12.3047 1.53125L11.1667 2.66927L13.8333 5.33594L14.9714 4.19792C15.232 3.93725 15.232 3.51521 14.9714 3.25521L13.2474 1.53125C13.1171 1.40092 12.9466 1.33594 12.776 1.33594ZM10.1667 3.66927L2.5 11.3359V14.0026H5.16667L12.8333 6.33594L10.1667 3.66927Z" fill="#457EFF" />
                                    </svg>
                                    <p className="">Edit</p>
                                </div>
                            </div>
                        </div>
                        <div className="bread-crumb">
                            <div className="bread-crum">
                                <img src={arrowDown} alt="" />
                                <p className="crumb">/real-estate/<span>how-to-make-money</span></p>
                                <p>30 Aug 23</p>
                                <p>1:13 PM</p>
                                <p>ID 3476</p>
                                <div class="icons-flex">
                                    <img class="icon active" src={mystery} alt="" />
                                    <img class="icon" src={refresh} alt="" />
                                    <img class="icon" src={images} alt="" />
                                    <img class="icon " src={description} alt="" />
                                    <p class="icon " >SEO</p>
                                </div>
                            </div>
                            <div className="words">870 Words</div>
                        </div>


                        <div className="buttons-others flex">
                            <button className="draft-select">Draft</button>
                            <button >Review</button>
                            <button>Published</button>
                            <div className="flex key">
                                <img src={key} alt="" />
                                <p>Domain Names</p>
                            </div>
                            <div className="flex key">
                                <img src={chit} alt="" />
                                <p>Income Streams</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-left">
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked="checked" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </div>
                    <div className="card-right">
                        <div className="options">
                            <p className="heading">Guide to Building a Brand Identity Kit: The Ultimate Beginner’s Guide for Establishing a Strong Brand</p>
                            <div className="flex">
                                <div className="key">
                                    <p className="char char-red">(107 Char)</p>
                                    <img src={eye} alt="" />
                                </div>

                                <div className="seo">
                                    <p>SEO</p>
                                    <p className="percent percent-red">50%</p>
                                </div>

                                <div className="seo edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                        <path d="M12.776 1.33594C12.6055 1.33594 12.4347 1.40092 12.3047 1.53125L11.1667 2.66927L13.8333 5.33594L14.9714 4.19792C15.232 3.93725 15.232 3.51521 14.9714 3.25521L13.2474 1.53125C13.1171 1.40092 12.9466 1.33594 12.776 1.33594ZM10.1667 3.66927L2.5 11.3359V14.0026H5.16667L12.8333 6.33594L10.1667 3.66927Z" fill="#457EFF" />
                                    </svg>
                                    <p className="">Edit</p>
                                </div>
                            </div>
                        </div>
                        <div className="bread-crumb">
                            <div className="bread-crum">
                                <img src={arrowDown} alt="" />
                                <p className="crumb">/real-estate/<span>how-to-make-money</span></p>
                                <p>30 Aug 23</p>
                                <p>1:13 PM</p>
                                <p>ID 3476</p>
                                <div class="icons-flex">
                                    <img class="icon " src={mystery} alt="" />
                                    <img class="icon" src={refresh} alt="" />
                                    <img class="icon active" src={images} alt="" />
                                    <img class="icon " src={description} alt="" />
                                    <p class="icon " >SEO</p>
                                </div>
                            </div>
                            <div className="words">870 Words</div>
                        </div>


                        <div className="buttons-others flex">
                            <button className="draft-select">Draft</button>
                            <button >Review</button>
                            <button>Published</button>
                            <div className="flex key">
                                <img src={key} alt="" />
                                <p>Domain Names</p>
                            </div>
                            <div className="flex key">
                                <img src={chit} alt="" />
                                <p>Income Streams</p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    )
}



export default FrontPage

