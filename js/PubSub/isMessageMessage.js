export default function(data){
    return data && typeof data.type != 'undefined' && data.type == 'message';
}