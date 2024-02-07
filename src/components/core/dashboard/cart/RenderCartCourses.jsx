import { IoIosStar } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactStars from "react-stars";
import { removeFromCart } from "../../../../slices/cartSlice";

function RenderCartCourses(){

    const {cart} = useSelector((state) => state.cart);
    const dispatch= useDispatch();

    return(
        <div>
            {
                cart.map((course,index)=>{
                    <div>
                        <div>
                            <img src={course?.thumbnail} alt=""/>  
                            <div>
                                <p>{course?.courseName}</p>
                                <p>{course?.category?.name}</p>
                                <div> 
                                    <span>4.8</span>
                                    <ReactStars
                                        count={5}
                                        size={20}
                                        edit={false}
                                        activeColor="#ffd700"
                                        emptyIcon={ <IoIosStar />}
                                        fullIcon={<IoIosStar />}
                                    />
                                    <span>{course?.ratingAndReviews?.length} Rating</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button 
                            onClick={() => dispatch(removeFromCart(course._id))}>
                                <RiDeleteBin6Line />
                                <span>REMOVE</span>
                            </button>
                            <p>Rs. {course?.price}</p>
                        </div>
                    </div>   
                })
            }
        </div>
    )
}

export default RenderCartCourses;