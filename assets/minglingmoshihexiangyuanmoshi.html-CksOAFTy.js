import{_ as n,o as i,c as e,b as s}from"./app-DrE-gYV7.js";const d="/skill/assets/image-20230707025134216-z72phEbs.png",l={},a=s(`<h1 id="游戏编程模式-二-命令模式和享元模式" tabindex="-1"><a class="header-anchor" href="#游戏编程模式-二-命令模式和享元模式"><span>游戏编程模式（二）：命令模式和享元模式</span></a></h1><h2 id="命令模式" tabindex="-1"><a class="header-anchor" href="#命令模式"><span>命令模式</span></a></h2><p>​ 命令模式在GoF中有个晦涩的定义：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化；对请求排队或记录请求日志，以及支持可撤销的操作。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>​ 高度抽象的定义加上蹩脚的翻译使其难懂，接下来会使用一些代码案例描述我们开发过程中可能遇到的场景，并展示解耦的<strong>过程演化</strong>。</p><p><strong>一.</strong></p><p>​ 在实现人物控制的功能时，简单的实现会是：</p><div class="language-c++ line-numbers-mode" data-ext="c++" data-title="c++"><pre class="language-c++"><code>void InputHandler::handleInput()
{
    if (isPressed(BUTTON_X)) jump();
    else if (isPressed(BUTTON_Y)) fireGun();
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>二.</strong></p><p>​ 游戏中一般会有配置按键的功能，这时就要求类似jump()这种方法调用转变为可变换的东西，自然我们会将其用一个对象来表示，这时我们就进入了命令模式，用一个<strong>Command</strong>类来作为基类，将类似jump()这种游戏行为都定义为一个子类：</p><div class="language-c++ line-numbers-mode" data-ext="c++" data-title="c++"><pre class="language-c++"><code>// 定义子类
class JumpCommand : public Command
{
public:
    virtual void execute() { jump(); }
};
class FireCommand : public Command
{
public:
	virtual void execute() { fireGun(); }
};

class InputHandler
{
public:
    void handleInput();
    // 绑定命令的方法……
private:
    Command* buttonX_;
    Command* buttonY_;
    ...
};

void InputHandler::handleInput()
{
    if (isPressed(BUTTON_X)) buttonX_-&gt;execute();
    else if (isPressed(BUTTON_Y)) buttonY_-&gt;execute();
    ...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 此时就可以通过改变各个button变量的值来改变按键的设置。</p><p><strong>三.</strong></p><p>​ jump()这些行为方法一般会与某个玩家角色进行关联，但是我们不应该让方法去找它们控制的角色，而是应将角色对象作为参数传进去：</p><div class="language-c++ line-numbers-mode" data-ext="c++" data-title="c++"><pre class="language-c++"><code>class JumpCommand : public Command
{
public:
    virtual void execute(GameActor&amp; actor)
    {
    	actor.jump();
    }
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 这样做的好处就是可以灵活控制任意的角色，只需要传入不同的角色对象。但此时需要把actor角色对象与handleInput()方法进行解耦，把execute()的执行放到外面去：</p><div class="language-c++ line-numbers-mode" data-ext="c++" data-title="c++"><pre class="language-c++"><code>Command* InputHandler::handleInput()
{
    if (isPressed(BUTTON_X)) return buttonX_;
    if (isPressed(BUTTON_Y)) return buttonY_;
    ...
}

Command* command = inputHandler.handleInput();
if (command)
{
	command-&gt;execute(actor);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>四.</strong></p><p>​ 在典型的回合制策略游戏中，一般会有回滚这一概念，可以撤销或者重做玩家不喜欢的操作。命令模式完美地提供了这一问题的解决方案。</p><p>​ 比如，在实现移动某个单位的功能时，代码可能如下：</p><div class="language-C++ line-numbers-mode" data-ext="C++" data-title="C++"><pre class="language-C++"><code>class MoveUnitCommand : public Command
{
public:
	...
    virtual void execute()
    {
    	unit_-&gt;moveTo(x_, y_);
    }
private:
    Unit* unit_;
    int x_, y_;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 这里的命令更特殊，将x，y作为成员变量，这意味着控制代码会在玩家做出操作时创造一个实例：</p><div class="language-c++ line-numbers-mode" data-ext="c++" data-title="c++"><pre class="language-c++"><code>Command* handleInput()
{
    Unit* unit = getSelectedUnit();
    if (isPressed(BUTTON_UP)) {
        // 向上移动单位
        int destY = unit-&gt;y() - 1;
        return new MoveUnitCommand(unit, unit-&gt;x(), destY);
    }
    if (isPressed(BUTTON_DOWN)) {
        // 向下移动单位
        int destY = unit-&gt;y() + 1;
        return new MoveUnitCommand(unit, unit-&gt;x(), destY);
    }
    // 其他的移动……
    return NULL;
}	
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 在此基础上，可以增加一个记录移动之前位置的变量，来达到撤销操作的目的：</p><div class="language-c++ line-numbers-mode" data-ext="c++" data-title="c++"><pre class="language-c++"><code>class MoveUnitCommand : public Command
{
public:
    ...
    virtual void execute()
    {
        // 保存移动之前的位置
        xBefore_ = unit_-&gt;x();
        yBefore_ = unit_-&gt;y();
        unit_-&gt;moveTo(x_, y_);
    }
    virtual void undo()
    {
    	unit_-&gt;moveTo(xBefore_, yBefore_);
    }
private:
    Unit* unit_;
    int xBefore_, yBefore_;
    int x_, y_;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>五.</strong></p><p>​ 撤销和重做是一对正反操作，实现类似软件中的撤销列表和重做列表，只需将其维护成一个链表：</p><p>​ <img src="`+d+`" alt="image-20230707025134216"></p><h2 id="享元模式" tabindex="-1"><a class="header-anchor" href="#享元模式"><span>享元模式</span></a></h2><p>​ 享元模式非常简单，简单提一下。</p><p>​ 游戏开发中，如果要呈现一片巨大的森林，成千上万的树，每棵树都由上千的多边形组成，在不做任何优化的情况下，可以就是每秒送到GPU六十次的百万个多边形。</p><p><strong>一.</strong></p><p>​ 定义一个树看起来会是：</p><div class="language-C++ line-numbers-mode" data-ext="C++" data-title="C++"><pre class="language-C++"><code>class Tree
{
private:
    Mesh mesh_;  //多边形网格
    Texture bark_; 
    Texture leaves_; //树皮、树叶纹理
    Vector position_; //位置
    double height_;
    double thickness_; //高度厚度
    Color barkTint_;
    Color leafTint_; //颜色
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>二.</strong></p><p>​ 享元模式简单到甚至不需要去知道有这么个设计模式，自然地就会把它用在代码中。GoF称之为固有状态，即上下文无关的部分，剩余部分是变化状态，那些每个实例独一无二的东西。在这个例子中，是每棵树的位置，高度和颜色：</p><div class="language-C++ line-numbers-mode" data-ext="C++" data-title="C++"><pre class="language-C++"><code>class TreeModel
{
private:
    Mesh mesh_;
    Texture bark_;
    Texture leaves_;
};

class Tree
{
private:
    TreeModel* model_; //所有树共用一个模型实例
    Vector position_;
    double height_;
    double thickness_;
    Color barkTint_;
    Color leafTint_;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 拓展一下，多数情况下不会在一开始就创建所有享元，当你需要一个时，一般会先检查是否已经创建了一个相同的实例，这通常意味着需要将构造函数封装在检查实例是否已经存在的接口之后，这也许会用到<strong>工厂方法</strong>。</p><p>​ 为了返回一个已有的享元，通常需要一个存储它们的地方，使用<strong>对象池</strong>会是一个好办法。</p><p>​ 在<strong>状态模式</strong>（会在接下来的章节中总结）中，经常会出现一些没有任何“独一无二”字段的状态对象，这时享元模式会派上用场。</p>`,40),v=[a];function r(c,u){return i(),e("div",null,v)}const m=n(l,[["render",r],["__file","minglingmoshihexiangyuanmoshi.html.vue"]]),b=JSON.parse('{"path":"/blogs/jisuanjijishu/2024/youxibianchengmoshi/minglingmoshihexiangyuanmoshi.html","title":"游戏编程模式（二）：命令模式和享元模式","lang":"en-US","frontmatter":{"title":"游戏编程模式（二）：命令模式和享元模式","date":"2024/05/13","tags":["游戏开发"],"categories":["计算机技术"]},"headers":[{"level":2,"title":"命令模式","slug":"命令模式","link":"#命令模式","children":[]},{"level":2,"title":"享元模式","slug":"享元模式","link":"#享元模式","children":[]}],"git":{"createdTime":1716317782000,"updatedTime":1716317782000,"contributors":[{"name":"limbo","email":"limbo.com","commits":1}]},"filePathRelative":"blogs/计算机技术/2024/游戏编程模式/命令模式和享元模式.md"}');export{m as comp,b as data};
