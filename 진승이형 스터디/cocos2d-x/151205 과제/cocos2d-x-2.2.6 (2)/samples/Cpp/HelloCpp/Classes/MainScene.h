#ifndef __MAIN_SCENE_H__
#define __MAIN_SCENE_H__

#include "cocos2d.h"
#include "Mole.h"

class CCMainScene : public cocos2d::CCLayer
{
public:
	CCMole* m_pMole;

	// Here's a difference. Method 'init' in cocos2d-x returns bool, instead of returning 'id' in cocos2d-iphone
	virtual bool init();  

	// there's no 'id' in cpp, so we recommend returning the class instance pointer
	static cocos2d::CCScene* scene();

	// a selector callback
	void menuCloseCallback(CCObject* pSender);
	void randMoleAppear();

	// implement the "static node()" method manually
	CREATE_FUNC(CCMainScene);
};

#endif