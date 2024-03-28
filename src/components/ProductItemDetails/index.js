import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {},
    similarProductData: [],
    quality: 1,
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getEachProducts()
  }

  getFormattedData = data => ({
    title: data.title,
    imageUrl: data.image_url,
    brand: data.brand,
    price: data.price,
    rating: data.rating,
    description: data.description,
    availability: data.availability,
    id: data.id,
    total_reviews: data.total_reviews,
  })

  getEachProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstant.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      const updatedSimilarProductData = data.similar_products.map(eachProduct =>
        this.getFormattedData(eachProduct),
      )
      this.setState({
        productItemDetails: updatedData,
        similarProductData: updatedSimilarProductData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstant.failure,
      })
    }
  }

  onClickMinus = () => {
    const {quality} = this.state
    if (quality > 1) {
      this.setState(prevState => ({quality: prevState.quality - 1}))
    }
  }

  onClickPlus = () => {
    this.setState(prevState => ({quality: prevState.quality + 1}))
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader
        data-testid="loader"
        type="ThreeDots"
        color="#0b69ff"
        height="50"
        width="50"
      />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">Product Not Found</h1>
      <button type="button" className="btn">
        Continue Shopping
      </button>
    </div>
  )

  renderProductItemDetails = () => {
    const {productItemDetails, similarProductData, quality} = this.state

    return (
      <div className="product-item-detail-container">
        <div className="product-item-detail-top-container">
          <div className="product-item-detail-image-section">
            <img
              src={productItemDetails.imageUrl}
              alt="product"
              className="product-image"
            />
          </div>
          <div className="product-item-detail-test-container">
            <h1 className="heading" key="title">
              {productItemDetails.title}
            </h1>
            <div className="price-container">
              <p className="text-rate">Rs</p>
              <p className="price">{productItemDetails.price}</p>
              <p className="price-logo">/-</p>
            </div>
            <div className="rating-reviews">
              <div className="rating-view">
                <p className="rating">{productItemDetails.rating}</p>
                <p className="star">*</p>
              </div>
              <div className="review-container">
                <p className="reviews">{productItemDetails.total_reviews}</p>
                <p className="reviews-text">Reviews</p>
              </div>
            </div>

            <p className="description">{productItemDetails.description}</p>

            <div className="available">
              <p className="available-text">Available: </p>
              <p className="available-text-l">
                {productItemDetails.availability}
              </p>
            </div>
            <div className="brand">
              <p className="Brand-text">Brand: </p>
              <p className="Brand-text-l">{productItemDetails.brand}</p>
            </div>
            <hr className="line" />
            <div className="increment-number">
              <BsPlusSquare
                className="minus"
                onClick={this.onClickPlus}
                data-testid="plus"
              />
              <p className="text-number">{quality}</p>
              <BsDashSquare
                className="plus"
                onClick={this.onClickMinus}
                data-testid="minus"
              />
            </div>
            <button className="add-to-cart-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-product-container">
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="similar-unOrdered-list">
            {similarProductData.map(eachSimilarProduct => (
              <SimilarProductItem
                eachSimilarProduct={eachSimilarProduct}
                key={eachSimilarProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderAllProductItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderProductItemDetails()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView9
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderAllProductItemDetails()}
      </>
    )
  }
}
export default ProductItemDetails
