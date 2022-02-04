export class NotesModel{
    constructor(
        public title:string,
        public content:string,
        public date:string,
        public links?:string[],
    ){}
}