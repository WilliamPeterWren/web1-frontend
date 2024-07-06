import React,{useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import ProductItem from './ProductItem'
import { Link, useParams } from 'react-router-dom';

import apiCategory from '../../api/apiCategory';
import apiProduct from '../../api/apiProduct';
// import apiWishlist from '../../api/apiWishlist';
// import apiShoppingCart from '../../api/apiShoppingCart';

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);

    const catid = useParams().catid;  
    
    useEffect (() => {
        const fetchProducts = async (page, catid) => {
            try {   
                let response;
                const perPage = 8;

                if (catid) {
                    response = await apiProduct.getProductByCatId(catid, page);

                } else {
                    response = await apiProduct.getProductPagination(page, perPage);                    
                }
                // console.log(response.data);
                setProducts(response.data.data);
                setLastPage(response.data.last_page);

            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        fetchCategories();
        fetchProducts(currentPage, catid);
    }, [currentPage, currentCategory, catid]);    

    const fetchCategories = async (page) => {
        try {
            await apiCategory.getCategoryPagination(page)
            .then((response) => {
                setCategories(response.data);

            })
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleClick = async (categoryId) => {
        try {
            setCurrentCategory(categoryId);
            setCurrentPage(1); 
        } 
        catch (error) { 
            console.error('Error fetching products by category', error); 
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const chunkArray = (array, size) => {
        // console.log("products: ",products)
        const chunkedArr = [];
        for (let i = 0; i < array?.length; i += size) { 
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    const productRows = chunkArray(products, 4);

 
    

  return (
    <div>
    <div>
        <div id="breadcrumb" className="section">
            <div className="container">
                <div className="col-md-12">
                    <div className="section-title">
                        <h3 className="title">Danh mục sản phẩm</h3>
                        <div className="section-nav">
                            <ul className="section-tab-nav tab-nav">
                                {categories.map(category => (
                                    <li key={category.id} className={category.id === currentCategory ? "active" : ""}>
                                        <Link
                                            id={category.id}
                                            onClick={() => handleClick(category.id)}
                                            data-toggle="tab"
                                            to={`/products/categories/${category.id}`}
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="section">
            <div className="container">
                {productRows.map((row, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {row.map((product) => (
                            <div className="col-md-3 col-xs-3" key={product.id}>
                                <ProductItem product={product}  />
                            </div>
                        ))}
                    </div>
                ))}

                
                <div className="pagination">
                    {Array.from({ length: lastPage }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
</div>

  )
}

export default ProductPage
