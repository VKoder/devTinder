const adminAuth = (req, res, next)=>{
    const token = '123';
    const isAuthticated = token === '123' ? true : false;
    if(!isAuthticated){
        res.status(401).send('Unauth user')
    }
    else{
        next()
    }
}

const userAuth = (req, res, next)=>{
    const token = '1223';
    const isAuthticated = token === '123' ? true : false;
    if(!isAuthticated){
        res.status(401).send('Unauth user')
    }
    else{
        next()
    }
}
module.exports = {
    adminAuth, userAuth
}