---
title: 使用JavaSeurity进行数字签名(一)
tags: signature
categories: IT
date: 2019-04-24 14:26:26
---

Hello,my blog.好久不见.由于最近项目有些地方有涉及到数字签名,RSA加解密,数字证书等东西.虽然对其不太了解,也没有过多的影响到自己的开发,但是抱着一颗好奇的心,对其相关知识进行了网上冲浪,现在对自己所看到的相关资料,进行自我整理以及消化.在这一章,你将了解到[什么是数字签名] [什么是公钥私钥] [JAVA如何生成公钥私钥进行数字签名]

## 数字签名

>数字签名何时诞生? 

1976年，Whitfield Diffie 和 Martin Hellman 两人第一次提出了数字签名的概念，当时虽然他们并没有现成的方法去得到数据的数字签名，但是他们推测可以使用相关数学函数去进行计算获取 到数字签名，这个方案是可行的。随后不久， Ronald Rivest, Adi Shamir, 和 Len Adleman便研究出了RSA算法，这是一个可以生成数字签名的算法(虽然当时RSA算法得到的数字签名被公认为还是不安全的)最后第一个可以为指定数据生成数字签名的软件包诞生， Lotus Notes 在1989年将其发布。

>数字签名是什么

简单来说，数字签名就是使用公认可靠的签名算法，使用公钥加密技术，生成一段数据的一串散列值。比如<code>hello,zazalu</code>这串数据的数字签名就类似于<code>BE459576785039E8</code>，我们可以将这一串值理解为非常难以破解的东西。

>数字签名的用武之地在哪里

我用一个生活中的简单例子来做个比喻.

当我们收到自己爱人的来信时，激动不已的你急忙打开并且进行阅读。在这个简单的环节中，人的大脑其实自动帮你做了一个简单的验签的过程，你在看到那些熟悉的字体，熟悉的称呼或者一个简单的暗号后，你就为潜在的认为这封信确实是你的爱人写的，因为只有你熟悉他(她)的写法，只有你才知道暗号的含义。

数字签名其实起到的就和“暗号”“写法”这类东西类似，都是用来证明发件人确实是你爱人用的。在没有数字签名之前，我们在网上收到一封重要文件，虽然系统提示你发件人为A，但是并不代表真的是A，有可能是B正好偷偷用A的电脑发的也说不定。总而言之，在没有数字签名的时候，你无法确定发件人是谁。而数字签名就是起到证明发件人确实是A的作用的东西。

>数字签名如何生成？

在前面，我有说到，数字签名是使用公认可靠的签名算法，使用公钥加密技术，为数据生成一串散列值。那么具体是怎么样的呢？

首先我们来简单说明下公钥加密技术，目前我们常用于数字签名的公钥加密技术有两种，一个是RSA，还有一个是DSA。不过在进行数字签名这方面，他们的行为在语言描述上是一致的，这里也就不做区分说明。

不管是RSA还是DSA算法，他们都需要两个密钥，一个叫公钥，一个叫私钥。使用加密算法前，我们需要先使用相关算法库，生成一对密钥对，使用公钥加密的信息只能由私钥进行解密

是的，由于公钥是公有的，谁都能获取，所以按逻辑上来说，我们不应该使用私钥进行加密。但是我们却可以利用这一点来验证这串数据是由谁加密的，因为私钥是保密的。我使用私钥生成一串数字签名，那么只要使用我的公钥解析数字签名并且使用相同算法比较数据的散列值，如果是一样的，就说明这个数据就确实是由我发出的，不会有假。这也就说明了数字签名的有效性，可靠性。

>参考

上面几节，不知道讲没讲明白，但是我已经把我自己的理解全部整理了一遍，如果您还是不理解，不妨可以试试下面链接，都说明的不错

1. https://security.stackexchange.com/questions/66392/why-should-i-sign-data-thats-already-encrypted
2. https://docs.oracle.com/javase/tutorial/security/apisign/step3.html
3. https://www.jianshu.com/p/090e35989501

## JAVA如何生成数字签名

>获取RSA密钥对的接口方法getRSAKeyPair


```java 
public KeyPair getRSAKeyPair() throws NoSuchAlgorithmException{
    //获得一个密码随机数生成器(用于密钥生成),使用SecureRandom以及SHA1PRNG 
    KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");//获得密钥生成器,java语言使用KeyPairGenerator
    //SHA1PRNG意思便是使用SHA1密码散列函数,来生成伪随机数,PRNG = pseudo random number generator  
    // 有兴趣的同学可以进行深入研究, 这里不会探讨此问题        
    //我们的示例使用SHA1,当然你也可以试试SHA-2，SHA-3       
    SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
    //初始化1024位密钥生成器       
    keyGen.initialize(1024,random);        
    //生成公钥私钥      
    return keyGen.generateKeyPair();
} 
```

>使用我们刚刚生成的密钥对去生成指定文件的数字签名,getFileSignature接口参数,file为你指定的文件,keypair为你使用getRSAKeyPair生成的密钥对

```java
public Signature getFileSignature(File file,KeyPair keyPair) throws NoSuchAlgorithmException, InvalidKeyException, IOException, SignatureException {
        if(file == null){
            throw new FileNotFoundException();
        }
        //获取一个签名器,注意：生成密钥对的时候使用的是什么非对称加密算法和什么散列函数,String参数就填写对应"XXXXwithXXX"
        //e.g. DSA密钥对,使用SHA1PRNG,则为"SHA1withDSA"
        Signature dsa = Signature.getInstance("SHA1withRSA");
        //使用私钥初始化签名器,注意：请不要使用公钥初始化,只有私钥才能用来生成数字签名
        PrivateKey priv = keyPair.getPrivate();
        dsa.initSign(priv);
        //使用签名器的update方法将要进行签名文件的数据导入到签名器中(光看api就感觉很类似导入的感觉,所以就这么说明了,如有违和的地方请指正)
        dsa = updateDsaSignture(dsa,file);
        //获取数字签名
        return dsa;
    }
/**
 * 将文件数据导入至签名器中
 * @param dsa 签名器
 * @param file 需进行签名的文件
 * @Return: dsa 数据导入完毕的签名器
 * @Creator: hejj
 */
private Signature updateDsaSignture(Signature dsa,File file) throws IOException, SignatureException {
        FileInputStream fis = new FileInputStream(file);
        BufferedInputStream bufin = new BufferedInputStream(fis);
        byte[] buffer = new byte[1024];
        int len;
        while ((len = bufin.read(buffer)) >= 0) {
            dsa.update(buffer, 0, len);
        }
        bufin.close();
        return dsa;
    }
```

>把数字签名和公钥保存到本地

```java
public void saveSignature(File signFile, Signature signature) throws IOException, SignatureException, NoSuchAlgorithmException, InvalidKeyException {
        if(signFile == null){
            signFile = new File("../resource/signFile");
        }
        if(signFile.exists()){
            signFile.delete();
        }else{
            signFile.createNewFile();
        }
        FileOutputStream sigfos = new FileOutputStream(signFile);
        sigfos.write(signature.sign());
        sigfos.close();
    }
private void savePublicKey(File pubKeyFile, PublicKey publicKey) throws NoSuchAlgorithmException, IOException {
        if(pubKeyFile == null){
            throw new FileNotFoundException();
        }
        if(pubKeyFile.exists()){
            pubKeyFile.delete();
        }else{
            pubKeyFile.createNewFile();
        }
        byte[] key = publicKey.getEncoded();
        FileOutputStream keyfos = new FileOutputStream(pubKeyFile);
        keyfos.write(key);
        keyfos.close();
    }
```

>将所有接口整合，运行起来的demo

```java
@Test
public void signFile() throws NoSuchAlgorithmException, InvalidKeyException, IOException, SignatureException {
    MyRsaDsaUtil rsaDsaUtil = new MyRsaDsaUtil();
    //获取密钥对
    KeyPair keyPair = rsaDsaUtil.getRSAKeyPair();
    //获取文件签名(请先预创建自己的rsaSigndFile文件)
    String signFilePath = URLDecoder.decode(MyRsaDsaUtil.class.getResource("../resource/rsaSignFile")
            .getFile(),"utf-8") ;
    Signature signature = rsaDsaUtil.getFileSignature(new File(signFilePath),keyPair);
    //保存文件签名 保存后才能发送给别人哦
    String signDataFileUrl = "src/test/resource/signData" ;
    String pubKeyDataFileUrl = "src/test/resource/pubKeyData";
    rsaDsaUtil.saveSignature(new File(signDataFileUrl),signature);
    rsaDsaUtil.savePublicKey(new File(pubKeyDataFileUrl),keyPair.getPublic());
}
```

## 小节

本章我们先从数字签名的基础知识讲起，随后用了实际代码例子进行了练习，现在我们应该都已经学会了使用java生成某个文件的数字签名！

在下一章中，我们将作为文件接收者，去验证这个数字签名是否正确，从而完成一整个使用数字签名验证发件人有效性的整个流程。
