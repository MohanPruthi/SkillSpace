import React from 'react'

const UpdatePassword = () => {
    const {loading}=useSelector((state)=>state.auth);
    return (
        <div>
            {
                loading? (<div>Loading...</div>) :
                (
                    <div>
                        
                    </div>
                )
            }
        </div>
    )
}

export default UpdatePassword
