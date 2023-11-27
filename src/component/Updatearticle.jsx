import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { findPostTypeNameById, filterPublicationsByUserEmail } from "./filter"
import supabase from '../config/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import StatusSelection from '../FormDataInformation/StatusSelection';
import CategoryDropdown from '../FormDataInformation/CategoryDropDown';
import AuthorDropdown from '../FormDataInformation/AuthorDropdown';
import { Link } from 'react-router-dom';
import PostTypeButton from './Button/PostTypeButton';

import './FormPage.css'; // Import your CSS file

function Updatearticle() {

  const [statusId, setStatusId] = useState(1);
  const [typedUrl, setTypedUrl] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [category_id, setCategory_id] = useState(0);
  const [category_url, setCategory_url] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [tag, setTag] = useState('');
  const [keywords, setKeywords] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [authorId, setAuthorId] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [note, setNote] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [image_alt, setImage_alt] = useState('')
  const [categoryValue, setCategoryValue] = useState('')
  const [authorValue, setAuthorValue] = useState('')



  // Dropdown 
  const [publicationData, setPublicationData] = useState([]);
  const [postTypeData, setPostTypeData] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState();
  const [selectedPostType, setSelectedPostType] = useState();

  const [update, setUpdated] = useState(true)

  const { articleId } = useParams();





  useEffect(() => {
    async function fetchData() {
      // Fetch data from the 'publication' table
      const { data, error } = await supabase.from('user_publication').select(`
     *,
     user(*),
     publication(*)`
      );
      if (error) {
        throw error;
      }

      let tokenInfo = localStorage.getItem('sb-narivuecshkbtcueblcl-auth-token')
      const jsonObject = JSON.parse(tokenInfo);
      let email = jsonObject.user.email

      let filterData = filterPublicationsByUserEmail(data, email)
      setPublicationData(filterData);

      // Fetch data from the 'post_type' table
      const { data: postTypeData, error: postTypeError } = await supabase
        .from('post_type')
        .select('*');

      if (postTypeData) {
        setPostTypeData(postTypeData);
      } else {
        throw postTypeError;
      }
    }

    fetchData();
  }, []);



  useEffect(() => {
    async function fetchArticleData() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            *,
            articlestatus(*),
            authors(*),
            categories(*),
            post_type(*),
            publication(*)
          `)
          .eq('article_id', articleId)
          .single();


        if (error) {
          console.error('Error fetching article data:', error);
          // Handle error as needed (e.g., show an error message to the user)
          return;
        }

        // Populate the form fields with the fetched data
        setStatusId(data.articlestatus.status_id);
        setTypedUrl(data.url);
        setSeoScore(data.seo_score);
        setCategory_id(data.categories.category_id);
        setCategory_url(data.categories.url);
        setSeoTitle(data.seo_title);
        setSeoDescription(data.seo_description);
        setTag(data.tag);
        setKeywords(data.keyword);
        setFeaturedImage(data.featured_image);
        setAuthorId(data.authors.author_id);
        setCategoryValue(data.categories.name)
        setAuthorValue(data.authors.name)
        setImage_alt(data.image_alt)

        // Handle Date
        if (data.date) {
          const parsedDate = new Date(data.date);
          setDateInput(formatDateForInput(parsedDate)); // Set the initial value for the editable input
        }

        setTitle(data.title);
        setBody(data.body);
        setNote(data.note);
        setSelectedPublication(data.publication_id);
        setSelectedPostType(data.post_type.post_type_id);
      } catch (error) {
        console.error('Error fetching article data:', error);
      }
    }

    if (articleId) {
      fetchArticleData();
    }
  }, [articleId]);

  // Format the date to match the 'datetime-local' input format
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleStatusChange = (selectedStatusId) => {
    setStatusId(selectedStatusId);
    setUpdated(true)
  };

  const handlePublicationChange = (event) => {
    setSelectedPublication(event.target.value);
    setUpdated(true)
  };



  const handleCategoryChange = (selectedCategoryInfo) => {
    setCategory_id(selectedCategoryInfo.category_id);
    setCategory_url(selectedCategoryInfo.category_url);
    setUpdated(true)
  };

  const handleAuthorChange = (selectedAuthorId) => {
    setAuthorId(selectedAuthorId);
    setUpdated(true)
  };

  const handleDateInputChange = (event) => {
    // Update the dateInput state when the editable input value changes
    setDateInput(event.target.value);
    setUpdated(true)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedArticle = {
        status: statusId,
        publication_id: selectedPublication,
        post_type: selectedPostType,
        url: typedUrl,
        seo_score: seoScore,
        seo_title: seoTitle,
        seo_description: seoDescription,
        tag,
        keyword: keywords,
        featured_image: featuredImage,
        author_id: authorId,
        category_id: category_id,
        date: dateInput, // Use dateInput as the date value
        title,
        body,
        image_alt
      };






      // Use the `articleId` from the route to identify the article to update
      const { data, error } = await supabase
        .from('articles')
        .update(updatedArticle)
        .eq('article_id', articleId)


      if (error) {
        console.error('data', data);
        // Handle error as needed (e.g., show an error message to the user)
        return error.message;
      }


      setUpdated(false)
      // Optionally, you can show a success message to the user
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };




  const handleTextChange = (content) => {
    setBody(content);
    setUpdated(true)
    // Update the review content in the formData state

  };

  const handleTypeUrl = (e) => {
    setTypedUrl(e.target.value)
    setUpdated(true)
  }

  const handleSeoScore = (e) => {
    setSeoScore(e.target.value)
    setUpdated(true)
  }

  const handleFeaturedImage = (e) => {
    setFeaturedImage(e.target.value)
    setUpdated(true)
  }


  const handleImage_alt = (e) => {
    setImage_alt(e.target.value)
  }


  const handleTag = (e) => {
    setTag(e.target.value)
    setUpdated(true)
  }

  const handleKeyword = (e) => {
    setKeywords(e.target.value)
    setUpdated(true)
  }

  const handleSeoDescription = (e) => {
    setSeoDescription(e.target.value)
    setUpdated(true)
  }

  const handleSeoTitle = (e) => {
    setSeoTitle(e.target.value)
    setUpdated(true)
  }


  const handleTitle = (e) => {
    setTitle(e.target.value)
    setUpdated(true)
  }

  const handleNote = (e) => {
    setNote(e.target.value)
    setUpdated(true)
  }


  const handleButtonClick = (id, value) => {
    setSelectedPostType(id);

  };





  const resetForm = () => {
    setStatusId(1);
    setTypedUrl('');
    setSeoScore(0);
    setCategory_id(0);
    setCategory_url('');
    setSeoTitle('');
    setSeoDescription('');
    setTag('');
    setKeywords('');
    setFeaturedImage('');
    setAuthorId(0);
    setDateInput('');
    setTitle('');
    setBody('');
    setNote('');
  };

  // Add Page button click handler
  const handleAddPage = () => {
    resetForm(); // Reset the form

    setUpdated(false)
    const syntheticEvent = { preventDefault: () => { } }; // Create a synthetic event
    handleSubmit(syntheticEvent); // Submit the data
  };


  const TextEditorModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const TextEditorFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
  ];




  return (
    <div className="container">
      <div className="selectors">
        <select
          name="publicationDropdown"
          id="publicationDropdown"
          onChange={handlePublicationChange}
          value={selectedPublication}
        >
          {publicationData.map((publication) => (
            <option
              key={publication.publication_id}
              value={publication.publication_id}
            >
              {publication.publication_name}
            </option>
          ))}
        </select>

        <PostTypeButton onChangeValue={handleButtonClick} formValue={selectedPostType} />
      </div>
      <div className="flex" style={{ margin: '1rem 0' }}>
        {/* <button class="back-button" onClick={() => (window.location.href = "/")}>Back</button> */}
        <Link to ={"/"}>Back</Link>
        <Link to={`/addarticle/${selectedPublication}/${selectedPostType}`} className="add-page-button" onClick={handleAddPage}>
          Add {findPostTypeNameById(postTypeData, parseInt(selectedPostType))}
        </Link>
        <img src="/images/plus.svg" alt="" />
        <div className='formPage'>
          <form action="" >
            <div className="button-div">
              <button className="button-light btn" type="button" onClick={resetForm}>
                Delete
              </button>
              <button
                className={`${update ? 'button-blue' : 'button-grey'}`}
                type="submit"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="form-card">
        <div className="flex gap-between">
          <div className="flex child-margin">
            <p>Status</p>
            <StatusSelection
              selectedStatusId={statusId}
              onStatusChange={handleStatusChange}
              required
            />
          </div>
        </div>

        <div className="flex">
          <p style={{ marginRight: '1rem' }}>Category</p>
          <CategoryDropdown onCategoryChange={handleCategoryChange} categoryValue={categoryValue} publicationValue={selectedPublication} required />
        </div>

        <div className="flex">
          <p style={{ marginRight: '1rem' }}>URL</p>
          <div className="url-section">
            /{category_url}/
            <span>
              <input
                type="text"
                value={typedUrl}
                onChange={handleTypeUrl}
                placeholder="Type your URL here"
              />
            </span>
          </div>
        </div>

        <div className="flex">
          <p style={{ marginRight: '5rem' }}>SEO Score</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Enter SEO Score"
              value={seoScore}
              onChange={handleSeoScore}
              min="0"
              max="100"
            />
            <p>%</p>
          </div>
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Enter SEO Title"
            value={seoTitle}
            onChange={handleSeoTitle}
          />
        </div>

        <div className="flex">
          <textarea
            placeholder="Enter SEO Description"
            value={seoDescription}
            onChange={handleSeoDescription}
            rows="4"
            cols="10"
          />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Tag"
            value={tag}
            onChange={handleTag}
          />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Keywords"
            value={keywords}
            onChange={handleKeyword}
          />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Featured Image"
            value={featuredImage}
            onChange={handleFeaturedImage}
          />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="image_alt"
            value={image_alt}
            onChange={handleImage_alt}
          />
        </div>

        <div className="flex">
          <p style={{ marginRight: '5rem' }}>Author</p>
          <AuthorDropdown onAuthorChange={handleAuthorChange} authorValue={authorValue} publicationValue={selectedPublication} required />
        </div>

        <div className="flex">
          <p style={{ marginRight: '5rem' }}>Date</p>
          <input
            type="datetime-local"
            placeholder="Date"
            value={dateInput}
            onChange={handleDateInputChange}
            style={{ width: '200px' }}
          />
        </div>

        <div className="flex">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitle}
          />
        </div>

        <div style={{ width: '1050px' }}>
          <ReactQuill
            value={body}
            onChange={handleTextChange}
            placeholder="Enter your text here..."
            modules={TextEditorModules}
            formats={TextEditorFormats}
            style={{ height: '800px', marginBottom: '100px' }}
          />
        </div>

        <div className="flex">
          <textarea
            placeholder="Note"
            value={note}
            onChange={handleNote}
            rows="4"
          />
        </div>


      </div>
    </div>
  );
}

export default Updatearticle;
