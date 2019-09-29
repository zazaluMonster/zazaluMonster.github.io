---
title: 使用JavaSeurity进行数字签名(二)
tags: signature
categories: IT
date: 2019-04-24 14:45:12
---

在上一章中，我们使用JavaSeurityAPI对dsaSignFile文件进行了一次数字签名，并且将其数字签名以及公钥都保存到了本地硬盘的相应文件中。作为发送方，我们通过各种“交通”手段，将这三个文件一一发给了接收方。在本章我们就来展示接收方如何使用这三个文件，对数字签名进行验证，最终确定dsaSignFile的确实是由发送方发出的

>什么是验签

接收方获取到原数据文件，公钥文件，数字签名文件后，使用这三个文件便可以完成验签。验签的基本流程简单来说如下

1. 使用公钥文件将数字签名还原为散列值A
2. 使用加签时相同的算法获取原数据文件的散列值B
3. 对比A和B是否一致，若一致便说明数字签名正确，该文件确实是发送方发出，而不是由别人篡改后发出的

>JavaSeurity进行验签

1.使用公钥文件获取公钥
```java
private PublicKey getPubFromPubFile(File pubFile) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        //从文件中获取公钥字节数据
        FileInputStream keyfis = new FileInputStream(pubFile);
        byte[] encKey = new byte[keyfis.available()];
        keyfis.read(encKey);
        keyfis.close();
        //先将公钥字节数据转换为key specification，只有key specification才能使用KeyFactory转化为PublicKey Object
        //key specification你可以理解为密钥的一种格式，是密钥字节数据的升级
        X509EncodedKeySpec pubKeySpec = new X509EncodedKeySpec(encKey);
        //使用KeyFactory，通过key specification获取PublicKey Object
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey pubKey = keyFactory.generatePublic(pubKeySpec);
        return pubKey;
    }
```

2.使用数字签名文件获取数字签名字节数据
```java
private byte[] getSignatureBytesFromSignFile(File signFile) throws IOException {
        FileInputStream sigfis = new FileInputStream(signFile);
        byte[] sigToVerify = new byte[sigfis.available()];
        sigfis.read(sigToVerify);
        sigfis.close();
        return sigToVerify;
    }
```

3.使用原数据，公钥，数字签名字节数据验证正确性
```java
private boolean verifySignature(PublicKey publicKey,File dataFile,byte[] sigToVerify) throws NoSuchAlgorithmException, InvalidKeyException, IOException, SignatureException {
        //这次我们使用公钥初始化签名器
        Signature sig = Signature.getInstance("SHA1withRSA");
        sig.initVerify(publicKey);
        //将原数据导入签名器
        FileInputStream datafis = new FileInputStream(dataFile);
        BufferedInputStream bufin = new BufferedInputStream(datafis);
        byte[] buffer = new byte[1024];
        int len;
        while (bufin.available() != 0) {
            len = bufin.read(buffer);
            sig.update(buffer, 0, len);
        }
        bufin.close();
        //使用签名器进行验证
        boolean verifies = sig.verify(sigToVerify);
        return verifies;
    }
```

4.前三步整合为一个验签程序如下
```java
@Test
    public void verifySign() throws NoSuchAlgorithmException, IOException, InvalidKeySpecException, SignatureException, InvalidKeyException {
        String pubKeyDataFileUrl = "src/test/resource/pubKeyData";
        PublicKey publicKey = getPubFromPubFile(new File(pubKeyDataFileUrl));
        String signDataFileUrl = "src/test/resource/signData" ;
        byte[] sigToVerify = getSignatureBytesFromSignFile(new File(signDataFileUrl));
        String dsaSignFileUrl = "src/test/resource/dsaSignFile" ;
        boolean verifies = verifySignature(publicKey,new File(dsaSignFileUrl),sigToVerify);
        System.out.println("signature verifies: " + verifies);
    }
```

>存在的隐患

到目前为止，使用Java进行加签验签的过程已经全部测试完毕了，但是在我们的这个流程中存在一个隐患。那就是我们不能确保接收方获得的公钥文件是正确的。

打个比方，如果发送方在发出原数据，公钥文件，数字签名文件后，被中间人拦截。中间人为了达到自己的目的，篡改了原数据的内容，并且使用自己的私钥重新生成了一份新的数字签名文件，并且把公钥文件也替换为自己的公钥文件。然后将这三个文件再发送给接收方。接收方的验签过程并不会报错，从而导致接收方将错误的信息信以为真。

为了避免这样的情况发生，目前的解决方法之一就是使用数字证书。一个数字证书是由国际上公认的机构进行颁发，每个数字证书中包含了发送方的公钥，以及一个该证书内容的数字签名。接收方则在本地密钥库中寻找该数字证书所对应的公钥数据，如果存在，则使用它解开这个数字证书，随后拿到发送方的公钥。这个过程中最终我们的信任方是计算机本地存储的受信任的根证书列表，只要保证它的正常运作，那么就不会发生被人篡改的情况

>小节
java的数字签名练习就到此结束了。本来我还想着写一下RSA加解密，但是发现其实在流程本质上和数字签名是一致的，所以就不浪费时间重新赘述了

<div id="donationPoint">