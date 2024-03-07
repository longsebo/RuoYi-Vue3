
//动态变量开始指令
const INSTRUCT_DYNAMICVAR_START="\\$\\{";
// 动态变量结束指令
const INSTRUCT_DYNAMICVAR_END="\\}";

//替换动态变量
export function replaceDynamicVar(jsonObj,contextMap, line){
    let Text =line;
    // Find resource links
    reg = new RegExp(INSTRUCT_DYNAMICVAR_START+"(.+?)"+INSTRUCT_DYNAMICVAR_END, "gi");
    let result='';
    let retText = Text;
    while ((result = reg.exec(Text)) !== null) {
        let key = result[1].trim();
        let val = getExpValue(jsonObj,contextMap,key);
        retText = retText.replace(new RegExp(INSTRUCT_DYNAMICVAR_START+key+INSTRUCT_DYNAMICVAR_END,"g"), val);
    }
    return retText;

}
//获取表达式的值
export function getExpValue(jsonObj,contextMap1,exp){
    //优先从jsonObj获取
    var arr = exp.split('.');
    let val = getValByPath(0,arr,jsonObj);
    //如果取不到，再从contexMap1获取
    if(val==null|| typeof(val)=="undefined"){
        let parentObj = null;
        for(let i=0;i<arr.length;i++) {
            if(parentObj==null){
                parentObj = contextMap1.get(arr[i]);
                if(parentObj==null){
                    return "";
                }
            }else{
                parentObj= parentObj[arr[i]]
            }
        }
        //null转换为空串
        if(parentObj!=null) {
            return parentObj;
        }else{
            return "";
        }
    }else{
        if(val!=null) {
            return val;
        }else{
            return "";
        }
    }
}
//根据json表达式，从json对象获取值
export function getValByPath(index, keys, obj) {
    try {
        if (typeof obj == "undefined"||obj == null) {
            return null;
        }
        if (index == keys.length - 1) {
            return obj[keys[index]];
        }
        return getValByPath(index + 1, keys, obj[keys[index]]);
    }catch(e){
        console.log(e);
    }
}
