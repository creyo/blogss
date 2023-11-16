export function filterArticles(articles, selectedPublicationId, selectedPostTypeId, selectedStatusId) {
  if (!Array.isArray(articles)) {
    return [];
  }

  return articles.filter((article) => {
    const publicationId = article.publication?.publication_id;
    const postTypeId = article.post_type?.post_type_id;
    const statusId = article.articlestatus?.status_id;

    // Check if either publication_id or post_type_id or status_id matches the selected values
    const matchesPublication = selectedPublicationId === null || publicationId === selectedPublicationId;
    const matchesPostType = selectedPostTypeId === null || postTypeId === selectedPostTypeId;
    const matchesStatus = selectedStatusId === null || statusId === selectedStatusId;

    // Calculate the commonData using logical AND (if all conditions are true, keep the article)
    const commonData = matchesPublication && matchesPostType && matchesStatus;

    return commonData;
  });
}



export function filterArticlesPostTypeCount(articles, selectedPublicationId) {
  if (!Array.isArray(articles)) {
    return [];
  }

  return articles.filter((article) => {
    const publicationId = article.publication?.publication_id;

    // Check if the publication_id matches the selected value
    const matchesPublication = selectedPublicationId === null || publicationId === selectedPublicationId;

    return matchesPublication;
  });
}







export function filterPublicationsByUserEmail(data, userEmail) {
  const filteredPublications = [];

  for (const item of data) {
    if (item.user.email === userEmail) {
      const publicationDetails = {
        publication_id: item.publication.publication_id,
        publication_name: item.publication.publication_name,
        domain_name: item.publication.domain_name
      };
      filteredPublications.push(publicationDetails);
    }
  }

  return filteredPublications;
}






export function formatDate(originalDate) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  let dateObject = new Date(originalDate);

  if (isNaN(dateObject)) {
    // Handle the case of an invalid date by returning the original date string
    return originalDate;
  }

  return dateObject.toLocaleDateString('en-IN', options);
}






export function countArticlesByStatus(articles) {
  // Initialize counters for each status type
  let allCount = 0;
  let publishedCount = 0;
  let reviewCount = 0;
  let draftCount = 0;
  let deletedCount = 0

  // Iterate through the articles and count them based on status
  articles.forEach((article) => {
    const statusId = article.articlestatus?.status_id;

    switch (statusId) {
      case 0:
        deletedCount++;
        break;
      case 1:
        draftCount++
        break;
      case 2: // Review
        reviewCount++;
        break;
      case 3:
        publishedCount++;
        break;
      default:
        break;
    }

    // Count all articles, regardless of status
    allCount++;
  });

  // Create an object to store the counts for each status type
  const counts = {
    all: allCount,
    published: publishedCount,
    review: reviewCount,
    draft: draftCount,
    deleted: deletedCount
  };

  return counts;
}




// Define a function to find the type name based on post_type_id
export function findPostTypeNameById(postTypeData, postTypeId) {
  const postType = postTypeData.find((type) => type.post_type_id === postTypeId);
  return postType ? postType.type_name : '';
}



export function filterItemsByPublicationId(items, publicationIdToFilter) {
  // Use the filter method to filter items based on publicationId
  return items.filter((item) => item.publication_id === publicationIdToFilter);
}


export function filterAuthorsByPublication(data, publicationIdToFilter) {
  const filteredAuthors = data
    .filter(item => item.publication.publication_id === publicationIdToFilter)
    .map(item => item.authors);

  return filteredAuthors;
}


export function filterArticlesCount(data, publicationId, postTypeId) {
  // Use the `filter` method to filter articles based on criteria
  const filteredArticles = data.filter(article => {
    return (
      article.publication_id === publicationId && article.post_type?.post_type_id === postTypeId
    );
  });

  return filteredArticles;
}



export function countWord(body) {
  const data = body.split(" ")
  return data.length
}


// Filter the articles based on the selected category

export const categoryFilter = (selectedCategory, articles) => {
  if (!Array.isArray(articles)) {
    // Handle the case where 'articles' is not an array
    return [];
  }

  return articles.filter(article => {
    if (selectedCategory === '') {
      return true; // No category selected, so show all articles
    }
    // Make sure the 'categories' property exists and has the 'url' property
    if (article.categories && article.categories.url) {
      return article.categories.url === selectedCategory;
    }
    return false;
  });
};
