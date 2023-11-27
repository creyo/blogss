import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { findPostTypeNameById, filterPublicationsByUserEmail } from "./filter"
import ReactQuill from 'react-quill';
import ProfilePopup from './popUp/ProfilePopup';
import { selectValue } from "./configuration"
import { useSelector } from 'react-redux';
import PostTypeButton from './Button/PostTypeButton';
import 'react-quill/dist/quill.snow.css';
import './FormPage.css'; // Import your CSS file
import StatusSelection from '../FormDataInformation/StatusSelection';
import CategoryDropdown from '../FormDataInformation/CategoryDropDown';
import AuthorDropdown from '../FormDataInformation/AuthorDropdown';
import supabase from '../config/supabase'; // Import the Supabase instance
import AddProduct from './popUp/AddProduct';



function FormPage() {

  const { publicationId, postTypeId } = useParams();
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
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [note, setNote] = useState('');

  const [publicationData, setPublicationData] = useState([]);
  const [postTypeData, setPostTypeData] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(publicationId);
  const [selectedPostType, setSelectedPostType] = useState(postTypeId);

  const [highestarticleid, setHighestArticleId] = useState(0)

  const [submit, setSubmit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isProfilePopupOpen, setProfilePopupOpen] = useState(false);
  const [isAddButtonOpen, setIsAddButtonOpen] = useState(false);

  const [authorInfo, setAuthorInfo] = useState("")


  // const [settings, setSettings] = useState({
  //   category: false,
  //   seo: false,
  //   seoTitle: false,
  //   seoBody: false,
  //   tag: false,
  //   keyword: false,
  //   featuredImage: false,
  //   author: false,
  //   subTitle: false,
  //   note: false,  
  // });

  const settings = useSelector((state) => state.settings);


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
        throw postTypeError
      }
    }

    fetchData();
  }, []);

  console.log(publicationData)

  let tokenInfo = localStorage.getItem('sb-narivuecshkbtcueblcl-auth-token')
  const jsonObject = JSON.parse(tokenInfo);
  let userId = jsonObject.user.id


  //find highest article_id
  useEffect(() => {
    async function fetchHighestArticleId() {
      // Fetch data from the 'articles' table to find the highest article_id
      const { data, error } = await supabase.from('articles')
        // .select('*').order('article_id', { ascending: false }).limit(1);
        .select('*').order('article_id', { ascending: false }).limit(1);

      if (error) {
        throw error
      } else if (data.length > 0) {

        setHighestArticleId(data[0].article_id + 1);
      }
    }

    fetchHighestArticleId();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const newArticle = {
        status: statusId || null,
        publication_id: selectedPublication || null,
        post_type: selectedPostType || null,
        url: typedUrl,
        seo_score: seoScore || null,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        tag: tag || null,
        keyword: keywords || null,
        featured_image: featuredImage || null,
        author_id: authorId || null,
        category_id: category_id || null,
        date: date,
        title: title,
        body: body,
        user_id: userId,
      };

      if (isUpdating) {
        // Update the article with the highest article_id
        const { error } = await supabase
          .from('articles')
          .update(newArticle)
          .eq('article_id', highestarticleid);

        if (error) {
          throw error;
        }
      } else {
        // Create a new article
        const { error } = await supabase.from('articles').upsert([newArticle]);

        if (error) {
          throw error;
        }
        setIsUpdating(true);
        setSubmit(true);
      }
    } catch (error) {
      alert("fields can not be empty")
    }
  };



  const handleStatusChange = (selectedStatusId) => {
    setStatusId(selectedStatusId);
    setSubmit(false)
  };

  const handlePublicationChange = (event) => {
    setSelectedPublication(event.target.value);
    setSubmit(false)
  };



  const handleCategoryChange = (selectedCategoryInfo) => {
    setCategory_id(selectedCategoryInfo.category_id);
    setCategory_url(selectedCategoryInfo.category_url);
    setSubmit(false)
  };

  const handleAuthorChange = (selectedAuthorId) => {
    setAuthorId(selectedAuthorId);
    setSubmit(false)
  };


  const handleTextChange = (content) => {
    setBody(content);
    setSubmit(false)

  };
  const handleUrl = (e) => {
    setTypedUrl(e.target.value)
    setSubmit(false)
  }

  const handleSeoScore = (e) => {
    setSeoScore(e.target.value)
    setSubmit(false)
  }

  const handleSeoTitle = (e) => {
    setSeoTitle(e.target.value)
    setSubmit(false)
  }

  const handleSeoDescription = (e) => {
    setSeoDescription(e.target.value)
    setSubmit(false)
  }

  const handleTag = (e) => {
    setTag(e.target.value)
    setSubmit(false)
  }

  const handleKeywords = (e) => {
    setKeywords(e.target.value)
    setSubmit(false)
  }

  const handleFeatureImage = (e) => {
    setFeaturedImage(e.target.value)
    setSubmit(false)
  }


  const handleDate = (e) => {
    setDate(e.target.value)
    setSubmit(false)
  }

  const handleTitleChange = (e) => {
    let title = e.target.value
    setTitle(title)
    setSubmit(false)
  }




  const handleNote = (e) => {
    setNote(e.target.value)
    setSubmit(false)
  }



  const openProfilePopup = () => {
    setProfilePopupOpen(true);
  };

  const closeProfilePopup = () => {
    setProfilePopupOpen(false);
  };

  const saveProfile = (name, bio) => {
    // const authorInfo = `Author: ${name}<br>Bio: ${bio}`;
    const authorInfo = `<div class="blog-component-card author-info">
        <div class="author-name-intro">
            <h3>${name}</h3>
            <p>${bio}</p>
        </div>
                </div>`
    setBody((prevBody) => `${prevBody}<br>${authorInfo}`);
    setAuthorInfo(authorInfo)
  };

  console.log(authorInfo)
  console.log(body)



  const openAddProduct = () => {
    setIsAddButtonOpen(true);
  };

  const closeAddProduct = () => {
    setIsAddButtonOpen(false);
  };

  const handleAddButtonSave = (productData) => {
    // Handle the product data here
    // You can format the product data as needed
    const productInfo = `Product: ${productData.title}, <br> Description: ${productData.description}, <br> Link: ${productData.link}`;
    setBody((prevBody) => `${prevBody}<br>${productInfo}`);
    closeAddProduct();
  };

  const handleButtonClick = (id, value) => {
    setSelectedPostType(id);

  };


  //function to reset after click on add page 
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
    setAuthorId(1);
    setDate('');
    setTitle('');
    setBody('');
    setNote('');
  };

  // Add Page button click handler
  const handleAddPage = () => {
    const hasData =
      statusId !== 1 ||
      typedUrl !== '' ||
      seoScore !== 0 ||
      category_id !== 0 ||
      seoTitle !== '' ||
      seoDescription !== '' ||
      tag !== '' ||
      keywords !== '' ||
      featuredImage !== '' ||
      authorId !== 0 ||
      date !== '' ||
      title !== '' ||
      body !== '' ||
      note !== '';

    if (hasData) {
      setIsUpdating(!isUpdating); // Toggle isUpdating directly
      setHighestArticleId(highestarticleid + 1);
      resetForm(); // Reset the form
      const syntheticEvent = { preventDefault: () => { } }; // Create a synthetic event
      handleSubmit(syntheticEvent); // Submit the data
    }
  };








  const TextEditorModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };


  console.log(selectedPublication)


  const renderValidationTick = (length) => {
    const validationColor = selectValue(length, selectedPublication);
    if (validationColor === 'green') {
      return (
        <span className="tick-icon" style={{ color: 'green' }}>
          ✓
        </span>
      );
    } else if (validationColor === 'red') {
      return (
        <span className="tick-icon" style={{ color: 'red' }}>
          ❌
        </span>
      );
    }
    return null;
  };






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
        {/* back button will on home page */}
        <button class="back-button" onClick={() => (window.location.href = "/")}>Back</button>
        <button class="add-page-button" onClick={handleAddPage}>Add {findPostTypeNameById(postTypeData, parseInt(selectedPostType))}</button>
        <img src="/images/plus.svg" alt="" />
      </div>
      <div className="form-card">
        <div className="flex gap-between">
          <div className="flex child-margin">
            <p>Status</p>
            <StatusSelection
              selectedStatusId={statusId}
              onStatusChange={handleStatusChange}

            />
          </div>
        </div>

        {settings.category && <div className="flex">
          <p style={{ marginRight: '1rem' }}>Category</p>
          <CategoryDropdown onCategoryChange={handleCategoryChange} publicationValue={selectedPublication} />
        </div>}
        <div className="flex">
          <p style={{ marginRight: '1rem' }}>URL</p>
          <div className="url-section">
            /{category_url}/
            <span>
              <input
                type="text"
                value={typedUrl}
                onChange={handleUrl}
                placeholder="Type your URL here"
              />
            </span>
          </div>
        </div>

        {settings.seo && <div className="flex">
          <p style={{ marginRight: '5rem' }}>SEO Score</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Enter SEO Score"
              value={seoScore}
              onChange={handleSeoScore} // onChange for seoScore
              min="0"
              max="100"

            />
            <p>%</p>
          </div>
        </div>}

        {settings.seoTitle && <div className="flex">
          <input
            type="text"
            placeholder="Enter SEO Title"
            value={seoTitle}
            onChange={handleSeoTitle} // onChange for seoTitle
          />
        </div>}

        {settings.seoBody && <div className="flex">
          <textarea
            placeholder="Enter SEO Description"
            value={seoDescription}
            onChange={handleSeoDescription} // onChange for seoDescription
            rows="4"
            cols="10"
          />
        </div>}

        {settings.tag && <div className="flex">
          <input
            type="text"
            placeholder="Tag"
            value={tag}
            onChange={handleTag} // onChange for tag
          />
        </div>}

        {settings.keyword && <div className="flex">
          <input
            type="text"
            placeholder="Keywords"
            value={keywords}
            onChange={handleKeywords} // onChange for keywords
          />
        </div>}

        {settings.featuredImage && <div className="flex">
          <input
            type="text"
            placeholder="Featured Image"
            value={featuredImage}
            onChange={handleFeatureImage} // onChange for featuredImage
          />
        </div>}

        {settings.author && <div className="flex">
          <p style={{ marginRight: '5rem' }}>Author</p>

          <AuthorDropdown onAuthorChange={handleAuthorChange} publicationValue={selectedPublication} />
        </div>}

        <div className="flex">
          <p style={{ marginRight: '5rem' }}>Date</p>
          <input
            type="datetime-local"
            placeholder="Date"
            value={date}
            onChange={handleDate} // onChange for date
            style={{ width: '200px' }}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            min={40}
            max={60} />
          <span >{title.length}/60</span>
          {renderValidationTick(title.length)}
        </div>

        <button onClick={openProfilePopup} className="open-profile-button">Add Author</button>
        <ProfilePopup
          isOpen={isProfilePopupOpen}
          onClose={closeProfilePopup}
          onSave={saveProfile}
        />


        <button className="open-profile-button" onClick={openAddProduct}>Add Product</button>
        {isAddButtonOpen && (
          <AddProduct isOpen={isAddButtonOpen}
            onClose={closeAddProduct}
            onSave={handleAddButtonSave} />
        )}

        <div style={{ width: '1050px' }}>
          <ReactQuill
            value={body}
            onChange={handleTextChange}
            placeholder="Enter your text here..."
            modules={TextEditorModules}

            style={{ height: '800px', marginBottom: '100px' }}
          />
          <div dangerouslySetInnerHTML={{ __html: authorInfo }}></div>
        </div>


        {settings.note && <div className="flex">
          <textarea
            placeholder="Note"
            value={note}
            onChange={handleNote} // onChange for note
            rows="4"
          />
        </div>}

        <form action="" >
          <div className="button-div">
            <button className="button-light btn" type="button" onClick={resetForm}>
              Delete
            </button>
            <button
              className={`${submit ? 'button-grey' : 'button-blue'}`}
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPage;