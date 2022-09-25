// 消息总线

// Vue3从实例中移除了 $on、$off 和 $once 方法，所以我们如果希望继续使用全局事件总线，要通过第三方的库：
// Vue3官方有推荐一些库，例如 mitt 
import Mitt from "mitt"
const eventHub= new Mitt()
export default eventHub