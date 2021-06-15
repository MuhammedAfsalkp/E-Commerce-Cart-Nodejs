const deleteProduct=async (btn)=>{
try{
  const productId= btn.parentNode.querySelector('[name=productId]').value;
  const csrf= btn.parentNode.querySelector('[name=_csrf]').value;
  const productElement= btn.closest('article')

  let ris= await fetch(`/admin/product/${productId}`,{
      method:'DELETE',
      headers:{
          'csrf-token':csrf
      }
  })
  const data=await ris.json()
  console.log("success")
  console.log(data,data.message)
  if(data.message == "failed"){
       return }
   productElement.parentNode.removeChild(productElement)

  }catch(err){
      console.log("Catch block")
      console.log(err)

  }
  
}