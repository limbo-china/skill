import{_ as i,o as a,c as t,b as e}from"./app-DrE-gYV7.js";const l="/skill/assets/Pasted-image-20230802162555-BuYYTqbH.png",s="/skill/assets/Pasted-image-20230802165103-PhqxyBil.png",n="/skill/assets/Pasted-image-20230802171030-B9w0RRoO.png",p={},h=e('<p>本专栏系列将讨论关于计算机图形学的基础知识，适合入门者，计算机图形学就是利用数学和算法在计算机中展示和处理各种图像的学科，例如：虚拟现实模拟、图像处理、逼真的计算机动画等，它们可以是二维或者三维的。计算机图形领域主要围绕三大部分讨论：</p><ul><li>建模</li><li>渲染</li><li>动画</li></ul><p>当然也有一些其他内容被经常提起，比如：</p><ul><li>用户交互（UI）</li><li>虚拟现实（VR）</li><li>可视化</li><li>图像处理</li><li>三维扫描</li><li>计算摄影</li></ul><p>本章涉及到的数学知识回顾：</p><ul><li>$\\mathbb{R}$，实数集合</li><li>$\\mathbb{R}^{+}$，非负数实数集合</li><li>$\\mathbb{R}^{2}$，二维实数平面有序对</li><li>$\\mathbb{R}^{n}$，n维笛卡尔空间中的点集合</li></ul><h1 id="光栅图" tabindex="-1"><a class="header-anchor" href="#光栅图"><span>光栅图</span></a></h1><p>光栅图也叫位图、像素图，就是最小单位由像素构成的图，每个像素有自己的颜色，一张图就是一个像素矩阵，我们通常看到的PC、电视机、手机上的图像大部分都是位图。在真实的物理世界中，可以对一张图像做一个数学抽象，把一张图像看成是一个二维实数平面(R)到像素值集合(V)的映射，即：</p><p>$I(x, y) : R → V，where\\quad R ⊂ \\mathbb{R}^{2}$</p><p>当图像只是一张理想化的灰度图像时，图像只有亮度没有颜色，此时 V = $\\mathbb{R}^{+}$；而对一张理想化的RGB图像（每一个像素值由红绿蓝的三种原色的值来表示）来说，V = $(\\mathbb{R}^{+})^{3}$。但是，这只是实数域上的情况，而一张位图并不是连续的，此时我们就用平均值来表示。也就是说，如果一个像素点的值为x，它的意思就是说这个点邻近区域的平均值为x。假设我们用二维坐标系来表示一张图像，它的样子大致会是： <img src="'+l+'" alt="Pasted image 20230802162555.png"></p><p>上图中的蓝色点就是实际存储在计算机中的点，例如，对于一张RGB图像来说，这张图像在计算机中的存储大致会是：(0,0) = (100, 122, 250)；(0,1) = (63, 84, 204)……</p><h2 id="rgb" tabindex="-1"><a class="header-anchor" href="#rgb"><span>RGB</span></a></h2><p>大部分计算机图像是用RGB表示法来表示颜色的，所有颜色都是由红色、绿色、蓝色这三种光原色的混合比例不同来呈现的。所以我们经常能看到某一个像素点的颜色会表示为一个向量(100, 122, 250)的形式，就是分别代表了红绿蓝三种颜色的值，每一种颜色的值在计算机中占用了8bit，所以其范围是0-255之间的整数。或者也会用0-1之间的小数来表示，即(100/255, 122/255, 250/255)，颜色在坐标系中的分布可以用下图表示： <img src="'+s+'" alt="Pasted image 20230802165103.png"></p><h2 id="透明色-阿尔法合成" tabindex="-1"><a class="header-anchor" href="#透明色-阿尔法合成"><span>透明色（阿尔法合成）</span></a></h2><p>在计算机应用中，颜色合成随处可见：已有一种背景色，我们想用另外一种前景色来覆盖在背景色上。如果前景色是不透明的，背景色就完全被遮盖了；如果前景色是完全透明的，背景色就丝毫不受影响，我们用α值来表示两者之间被遮盖的程度。假设我们用一种前景色$C_{f}$来覆盖一种背景色$C_{b}$，则它们合成之后的颜色$C$可以表示为：</p><p>$C = αC_{f} + (1-α)C_{b}$</p><p>用一张图来举例说明此表达式， <img src="'+n+'" alt="Pasted image 20230802171030.png"> 图中α通道的白色区域代表此区域的α值为1，黑色区域代表此区域的α值为0。将背景色和前景色合成，并指定其α通道，就会得到第四张图。三角形区域的α值为1，最终合成图的此区域的颜色全部来源于前景图，同理，剩下区域的部分全部来源于背景图。</p><p>有一种图像叫做RGBA图像，代表其存储方式是用32bit分别存储了红绿蓝α值，每一个部分正好占用8bit。</p>',18),r=[h];function u(c,m){return a(),t("div",null,r)}const g=i(p,[["render",u],["__file","jisuanjituxingxuejichu（yi）：guangzhatu（weitu）.html.vue"]]),b=JSON.parse('{"path":"/blogs/jisuanjijishu/2024/jisuanjituxingxue/jisuanjituxingxuejichu（yi）：guangzhatu（weitu）.html","title":"计算机图形学基础（一）：光栅图（位图）","lang":"en-US","frontmatter":{"title":"计算机图形学基础（一）：光栅图（位图）","date":"2024/05/13","tags":["计算机图形学"],"categories":["计算机技术"]},"headers":[{"level":2,"title":"RGB","slug":"rgb","link":"#rgb","children":[]},{"level":2,"title":"透明色（阿尔法合成）","slug":"透明色-阿尔法合成","link":"#透明色-阿尔法合成","children":[]}],"git":{"createdTime":1716317782000,"updatedTime":1716317782000,"contributors":[{"name":"limbo","email":"limbo.com","commits":1}]},"filePathRelative":"blogs/计算机技术/2024/计算机图形学/计算机图形学基础（一）：光栅图（位图）.md"}');export{g as comp,b as data};
