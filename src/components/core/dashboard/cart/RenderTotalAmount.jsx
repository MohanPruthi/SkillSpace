import { useSelector } from "react-redux";
import IconButton from "../../../common/IconButton";

function RenderTotalAmount(){
    const {total}=useSelector((state)=>state.cart);

    const handleBuyCourse=()=>{

    }
  
    return(
        <div>
            <p>Total:</p>
            <p>Rs {total}</p>

            <IconButton 
                text="Buy Now"
                onclick={handleBuyCourse}
                customClasses={"w-full justify-center"}
            />
        </div>
  )
}

export default RenderTotalAmount;