export interface RequestOptions {
    isCustomRequest?: boolean;

    /**
     * 请求优先级
     */
    level?: number;

    /**
     * 是否提交token
     * 默认true
     */
    auth?: boolean;

    /**
     * 是否校验Token, 当服务端响应loginCode不为200且请求参数携带token时认为登录态失效，将清理token
     * 默认true
     */
    checkToken?: boolean;

    /**
     * 是否已form表单形式Post
     */
    formPost?: boolean;

    /**
     * 是否在url中添加token的query参数
     */
    qsToken?: boolean;

    /**
     * 是否在请求cookie字段添加token
     */
    cookieToken?: boolean;

    /**
     * 是否在请求头添加token
     */
    headerToken?: boolean;

    /**
     * token携带时的字段名，为query参数的key或者header头的key
     * 默认token
     */
    tokenKey?: string;

    // /**
    //  * 返回数据类型，默认json
    //  */
    // respMime?: string;
}

export interface NavBarStyleOptions {
    title?: string;
    frontColor?: 'white' | 'black';
    backgroundColor?: string;
}
