# dynamodb manager

This GUI tool to manage your local dynamodb.
If you have a better idea, welcome to issue.

![image](https://github.com/YoyaTeam/images/blob/master/dynamodb-manager/dynamodb-manager.gif)

## features

* Table
  * [x] Add Table
  * [x] Edit Table
  * [x] Delete Table
  * [x] Connect Table
  * [x] Add Index(GSI and LSI)
  * [x] Delete Index
* Item
  * [x] Add Item
  * [x] Edit Item
  * [x] Delete Item
  * [x] import/export Items
* Search (Table or Index)
  * [x] Scan Table 
  * [x] Query Table 
  * [x] Filter Condition 

## how to use

Here is a sample website that can be used https://dynamodb-manager.netlify.app/, 
You can also use docker to deploy the local version. https://hub.docker.com/r/taydy/dynamodb-manager/.
``` bash
docker pull taydy/dynamodb-manager
docker run -t -p 8080:80 taydy/dynamodb-manager
```
or you can build the project, and put the dist directory in amazon s3 and aliyun oss.

## show me
### setting
![image](http://image.yoyadoc.com/github/setting.png)

### config
![image](http://image.yoyadoc.com/github/config.png)

### table info
![image](http://image.yoyadoc.com/github/tableinfo.png)

### item search
![image](http://image.yoyadoc.com/github/item_search.png)

### table index
![image](http://image.yoyadoc.com/github/index.png)

## Build Setup

``` bash
# install dependencies
npm install

# build for production with minification
npm run build

# build image
docker build -t taydy/dynamodb-manager .

# run image
docker-compose up -d
```

## Issue
-  **applying the configuration but get error "Configuration is not in effect!"**

    please see [Cors](https://github.com/YoyaTeam/dynamodb-manager/issues/9) 
