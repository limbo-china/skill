import{_ as e,o as i,c as n,b as s}from"./app-DrE-gYV7.js";const d={},l=s(`<h1 id="游戏编程模式-三-观察者模式-观察者模式" tabindex="-1"><a class="header-anchor" href="#游戏编程模式-三-观察者模式-观察者模式"><span>游戏编程模式（三）：观察者模式 #观察者模式</span></a></h1><p>​ 只要你随便打开一个手机或者电脑的应用，十有八九它就用了MVC架构，观察者模式几乎随处可见，以至于在Java语言中它被放进了核心库中（java.util.Observer） ，C#语言中更是直接嵌入了语法（event关键字）。</p><p>​ 游戏开发中，说到观察者模式，典型的场景——成就系统：</p><p>一.</p><p>​ 设想一个场景，有一段物理系统相关的代码处理重力，并且追踪了哪些物体待在地表哪些坠入深渊，而开发者需要实现”从地表掉落到深渊“的成就。如果把成就相关代码放入物理相关代码中，那会是一团糟。当然，我们大概也不会这样做，通常会稍微做一些分离，比如把被追踪的物体和事件抽离出来：</p><div class="language-C++ line-numbers-mode" data-ext="C++" data-title="C++"><pre class="language-C++"><code>void Physics::updateEntity(Entity&amp; entity)
{
    bool wasOnSurface = entity.isOnSurface();
    entity.accelerate(GRAVITY);
    entity.update();
    if (wasOnSurface &amp;&amp; !entity.isOnSurface())
    {
    	notify(entity, EVENT_START_FALL);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 但这明显还不够，并没有完全解耦，现在可以直接引入观察者模式：</p><p>二.</p><p>​ <strong>观察者</strong></p><div class="language-C++ line-numbers-mode" data-ext="C++" data-title="C++"><pre class="language-C++"><code>class Observer
{
public:
    virtual ~Observer() {}
    virtual void onNotify(const Entity&amp; entity, Event event) = 0;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 实现了Observer类的具体类就成为了观察者，在成就系统中，可以是：</p><div class="language-C++ line-numbers-mode" data-ext="C++" data-title="C++"><pre class="language-C++"><code>class Achievements : public Observer
{
public:
    virtual void onNotify(const Entity&amp; entity, Event event){
        switch (event){
            case EVENT_ENTITY_FELL:
            if (entity.isHero() &amp;&amp; heroIsOnBridge_){
            	unlock(ACHIEVEMENT_FELL_OFF_BRIDGE);
            }
            ...
        }
    }
private:
    ...
    bool heroIsOnBridge_;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ <strong>被观察者</strong></p><div class="language-c++ line-numbers-mode" data-ext="c++" data-title="c++"><pre class="language-c++"><code>class Subject
{
private:
    Observer* observers_[MAX_OBSERVERS];
    int numObservers_;
public:
    void addObserver(Observer* observer){
    	// 添加到数组中……
    }
    void removeObserver(Observer* observer){
    	// 从数组中移除……
    }
    void notify(const Entity&amp; entity, Event event){
        for (int i = 0; i &lt; numObservers_; i++){
        	observers_[i]-&gt;onNotify(entity, event);
        }
    }
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 被观察的对象拥有通知的方法，并维护了一个列表，保存等它通知的观察者。现在可以让物理系统实现Subject类：</p><div class="language-c++ line-numbers-mode" data-ext="c++" data-title="c++"><pre class="language-c++"><code>class Physics : public Subject{
public:
    void updateEntity(Entity&amp; entity);
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>三.</p><p>​ <strong>多线程和同步</strong></p><p>​ 值得注意的是，观察者模式是同步的，也就是说，被观察者直接调用了观察者，这意味着直到所有观察者通知方法返回后，被观察者才会继续自己的工作。在UI线程中，这需要小心，对事件的同步响应应该尽快返回，否则会导致UI锁死。当有必要的耗时操作时，应该将其送到其它线程或者工作队列中去。而当进一步引入了线程和锁，要防止观察者获得被观察者拥有的锁，否则就会进入死锁。</p><p>四.</p><p>​ <strong>链式观察者</strong></p><p>​ 上述实现方法中，Subject拥有一列指针指向观察它的Observer。我们可以将观察者的列表分布到观察者自己中来解决内存的动态分配问题，链表在这里起到重要作用：</p><div class="language-C++ line-numbers-mode" data-ext="C++" data-title="C++"><pre class="language-C++"><code>class Subject{
private:
	Observer* head_;
    
    //添加和删除节点的方法 add/remove
    ...
};

class Observer{
friend class Subject;

private:
	Observer* next_;
};

void Subject::notify(const Entity&amp; entity, Event event)
{
    Observer* observer = head_;
    while (observer != NULL)
    {
        observer-&gt;onNotify(entity, event);
        observer = observer-&gt;next_;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 链表的各个基本操作在此就不展开叙述，当然，和其它单链表一样，在删除节点时需要遍历链表，所以进一步可以考虑引入双向链表来获得常量时间的删除操作。</p><p>​ 还有一个问题，被观察者是按链表的顺序来通知观察者的，这就要求观察者之间不应该有顺序相关性，否则观察者之间会依然存在一个微妙的耦合。</p><p>五.</p><p>​ <strong>链表节点池</strong></p><p>​ 继续深入，会发现之前的方法存在一个致命的问题：如果我们打算将某个观察者注册到不同的被观察者列表中，链表的节点添加操作会使得靠前加入的链表遭到破坏，链表节点池可以解决这一问题：</p><div class="language-C++ line-numbers-mode" data-ext="C++" data-title="C++"><pre class="language-C++"><code>class Node{

private:
	Observer* observer;
    Node* next;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​ 把链表节点本身和观察者的角色解耦，在每次将观察者加入列表时，新建一个Node节点。</p><p>六.</p><p>​ <strong>对象销毁</strong></p><p>​ 再往下深入，讨论一个被观察者或者观察者被删除时会发生什么。</p><p>​ 在C++这种可以主动进行内存回收的语言中，如果不小心在某些观察者上调用了delete，而被观察者仍然拥有指向它的指针，这时被观察试图发送一个通知，自然会导致程序出错，所以，在被删除时取消注册是观察者的职责，通常可以在它的析构器上加上removeObserver() 。</p><p>​ 如果是不小心在被观察者上调用delete，这倒是不会导致程序出错，但是它的观察者列表中的那些观察者可能就永远收不到通知了，这将造成内存浪费。解决办法也简单，让被观察者在它被删除前发送一个最终的“死亡通知” ，通知各观察者“自身死亡的消息”，观察者就可以做出相应的行为。</p><p>​ <strong>垃圾回收</strong></p><p>​ 那在那些不能主动进行内存回收的语言中呢？它们有垃圾回收器，不存在不小心调用delete的情况，但这并不能说明就安全了。</p><p>​ 设想一个场景：有UI显示玩家角色情况的状态，比如健康和道具。 当玩家在屏幕上时，你为其初始化了一个对象。 当UI退出时，直接忘掉这个对象，交给GC清理。每当角色脸上挨了一拳，就发送一个通知。 UI观察到了，然后更新健康槽， 当玩家离开场景，却没有取消观察者的注册。此时，UI界面不再可见，但也不会进入垃圾回收系统，因为角色的观察者列表还保存着对它的引用。 每一次场景加载后，将会给那个不断增长的观察者列表添加一个新实例。玩家玩游戏时，来回跑动，打架，角色的通知发送给所有的界面。 它们不在屏幕上，但它们接受通知，这样就浪费CPU循环在不可见的UI元素上了。</p>`,38),a=[l];function v(r,t){return i(),n("div",null,a)}const u=e(d,[["render",v],["__file","guanchazhemoshi.html.vue"]]),b=JSON.parse('{"path":"/blogs/jisuanjijishu/2024/youxibianchengmoshi/guanchazhemoshi.html","title":"游戏编程模式（三）：观察者模式","lang":"en-US","frontmatter":{"title":"游戏编程模式（三）：观察者模式","date":"2024/05/13","tags":["游戏开发"],"categories":["计算机技术"]},"headers":[],"git":{"createdTime":1716317782000,"updatedTime":1716317782000,"contributors":[{"name":"limbo","email":"limbo.com","commits":1}]},"filePathRelative":"blogs/计算机技术/2024/游戏编程模式/观察者模式.md"}');export{u as comp,b as data};
