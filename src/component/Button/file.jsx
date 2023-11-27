<div className="card-right">
    <div className="options">
        <div className='flex'>
            <p className="heading" >{article.title}  </p>
            <p className="char char-red" style={{ marginLeft: "20px" }}>({article.title.length} char)</p>
        </div>
        <div className="flex">
            <div className="key">
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
            <Icon article={article} article_id={article.article_id} onDataUpdate={handleDataUpdate} />
        </div>
        <div className="words">{countWord(article.body)} Words </div>
    </div>
    <div className="buttons-others flex">

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
