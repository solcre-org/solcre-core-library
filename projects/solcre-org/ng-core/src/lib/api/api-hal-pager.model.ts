export class ApiHalPagerModel{
    //Pager constructor
    constructor(
        public currentPage?: number,
        public totalPages?: number,
        public totalItems?: number){}
    
    //parse from json
    public fromJSON(json: any){
        //Check json object
        if(json){
            //Load current page
            if(json.page){
                this.currentPage = json.page;
            }
            //Load page count
            if(json.page_count){
                this.totalPages = json.page_count;
            }
            //Load total items
            if(json.total_items){
                this.totalItems = json.total_items;
            }
        }
    }
}