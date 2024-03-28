import {Link} from 'react-router-dom'

import './index.css'

const SimilarProductItem = props => {
  const {eachSimilarProduct} = props
  const {title, imageUrl, brand, price, rating, id} = eachSimilarProduct
  return (
    <Link to={`/products/${id}`}>
      <li className="similar-product-item">
        <img src={imageUrl} alt="product" className="thumbnail" key={id} />
        <h1 className="title">{title}</h1>
        <p className="brand">by {brand}</p>
        <div className="product-details">
          <p className="price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </li>
    </Link>
  )
}
export default SimilarProductItem
