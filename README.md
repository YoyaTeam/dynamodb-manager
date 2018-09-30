# dynamodb manager

We can use dynamodb manager to manage our local dynamodb. It has almost all the features. 
If you have a better idea or function, welcome to issue.

## how to use

Here is a sample website that can be used http://dynamodb.yoyadoc.com, 
You can also use docker to deploy the local version. https://hub.docker.com/r/taydy/dynamodb-manager/.
``` bash
docker pull taydy/dynamodb-manager
docker run -t -p 8080:80 taydy/dynamodb-manager
```
or you can build the project, and put the dist directory in amazon s3 and aliyun oss.

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