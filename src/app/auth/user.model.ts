export class UserModel{
    constructor(
        private idToken:string,
        public email:string,
        public refreshToken:string,
        public expiresIn:number,
        public localId:string,
        public registered:boolean){}
    get token(){
        if( this.expiresIn > new Date().getTime() ){
            return this.idToken;
        }
    }    
}