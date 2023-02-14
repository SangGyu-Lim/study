#include "MainScene.h"
#include "AppMacros.h"
USING_NS_CC;

cocos2d::CCScene* CCMainScene::scene()
{
	// 'scene' is an autorelease object
	CCScene *scene = CCScene::create();

	// 'layer' is an autorelease object
	CCMainScene *layer = CCMainScene::create();

	// add layer as a child to scene
	scene->addChild(layer);

	// return the scene
	return scene;
}

bool CCMainScene::init()
{
	if ( !CCLayer::init() )
	{
		return false;
	}

	CCSprite* pGirl = CCSprite::create("clickwon.png");

	if(pGirl)
	{
		pGirl->setPosition( ccp(100, 100));
		pGirl->runAction(CCSequence::create(
			CCFadeOut::create(2.0f),
			CCFadeIn::create(2.0f),
			NULL));

		this->addChild( pGirl);
	}

}

void CCMainScene::menuCloseCallback( CCObject* pSender )
{
#if (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT) || (CC_TARGET_PLATFORM == CC_PLATFORM_WP8)
	CCMessageBox("You pressed the close button. Windows Store Apps do not implement a close button.","Alert");
#else
	CCDirector::sharedDirector()->end();
#if (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
	exit(0);
#endif
#endif
}

