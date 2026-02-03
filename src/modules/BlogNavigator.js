/**
 * BlogNavigator - Handles navigation between blog and home screens
 * The Heart of Gold
 */

import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import stateManager, { AppStates } from '../utils/StateManager.js';
import audioManager from '../utils/AudioManager.js';
import transition from './Transition.js';
import blogLoadingScreen from './BlogLoadingScreen.js';
import blogScreen from './BlogScreen.js';
import blogManager from './BlogManager.js';

class BlogNavigator {
    constructor() {
        this.isNavigating = false;
        this.navigationPromise = null;
        this.abortController = null;
    }

    async navigateToBlog(blogId, sourceElement = null) {
        // Prevent concurrent navigation
        if (this.isNavigating || transition.isActive()) {
            console.warn('Navigation already in progress');
            return false;
        }

        // Validate blog exists
        const blog = blogManager.getBlogById(blogId);
        if (!blog) {
            console.error('Blog not found:', blogId);
            return false;
        }

        // Check if we can transition
        if (stateManager.isTransitioning()) {
            console.warn('Cannot navigate during state transition');
            return false;
        }

        this.isNavigating = true;
        this.abortController = new AbortController();
        
        try {
            stateManager.setCurrentBlogId(blogId);

            // Animate source element if provided
            if (sourceElement) {
                await this.animateSourceElement(sourceElement);
            }

            // Phase 1: Transition to blog loading
            stateManager.setState(AppStates.TRANSITION_TO_BLOG_LOADING, { blogId });
            await transition.transitionIn();

            // Create and show loading screen
            blogLoadingScreen.create(blog.title);
            stateManager.setState(AppStates.BLOG_LOADING, { blogId });
            
            await transition.transitionOut();
            await blogLoadingScreen.show();

            // Wait for minimum display time
            await blogLoadingScreen.waitMinimumTime();

            // Phase 2: Transition to blog
            stateManager.setState(AppStates.TRANSITION_TO_BLOG, { blogId });
            await transition.transitionIn();

            // Cleanup loading screen and create blog screen
            blogLoadingScreen.destroy();
            await blogScreen.create(blogId);

            stateManager.setState(AppStates.BLOG, { blogId });
            await transition.transitionOut();

            // Animate blog screen entrance
            await blogScreen.show();

            return true;
        } catch (error) {
            console.error('Navigation to blog failed:', error);
            this.handleNavigationError();
            return false;
        } finally {
            this.isNavigating = false;
            this.navigationPromise = null;
            this.abortController = null;
        }
    }

    async navigateToHome(targetSection = 'homepage') {
        // Prevent concurrent navigation
        if (this.isNavigating || transition.isActive()) {
            console.warn('Navigation already in progress');
            return false;
        }

        // Check current state
        if (!stateManager.isInBlogState()) {
            console.warn('Not in blog state, cannot navigate to home');
            return false;
        }

        this.isNavigating = true;

        try {
            stateManager.setState(AppStates.TRANSITION_FROM_BLOG);

            // Fade out blog music
            if (audioManager.currentMusic) {
                await audioManager.fadeOut(audioManager.currentMusic, 400);
            }

            await transition.transitionIn();

            // Hide and cleanup blog screen
            await blogScreen.hide();
            stateManager.setCurrentBlogId(null);

            stateManager.setState(AppStates.HOME, { targetSection });

            // Resume home music
            if (audioManager.isMusicEnabled()) {
                audioManager.playMusic('./src/music/day1theme_2.mp3', true);
            }

            await transition.transitionOut();

            // Scroll to target section after transition
            requestAnimationFrame(() => {
                this.scrollToSection(targetSection);
            });

            return true;
        } catch (error) {
            console.error('Navigation to home failed:', error);
            this.handleNavigationError();
            return false;
        } finally {
            this.isNavigating = false;
        }
    }

    async animateSourceElement(element) {
        if (!element) return;

        const shimmer = element.querySelector('.panel-shimmer');
        
        return new Promise(resolve => {
            const tl = gsap.timeline({ onComplete: resolve });
            
            tl.to(element, {
                y: -30,
                scale: 1.12,
                zIndex: 200,
                duration: 0.25,
                ease: 'power2.out',
                force3D: true
            });
            
            if (shimmer) {
                tl.to(shimmer, {
                    opacity: 1,
                    x: '250%',
                    duration: 0.4,
                    ease: 'power2.inOut',
                    force3D: true
                }, '-=0.15');
            }
            
            tl.to(element, {
                filter: 'brightness(1.8)',
                duration: 0.15,
                ease: 'power2.in'
            });
        });
    }

    scrollToSection(sectionId) {
        const scrollContainer = document.querySelector('.home-scroll-container');
        if (!scrollContainer) return;

        let targetId;
        switch (sectionId) {
            case 'homepage':
                targetId = 'home-hero';
                break;
            case 'overview':
                targetId = 'overview-section';
                break;
            case 'characters':
                targetId = 'characters-section';
                break;
            default:
                targetId = sectionId;
        }

        const section = document.getElementById(targetId);
        if (section) {
            gsap.to(scrollContainer, {
                scrollTop: section.offsetTop,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    }

    handleNavigationError() {
        // Force complete any pending transitions
        transition.forceComplete();
        
        // Cleanup any partial states
        blogLoadingScreen.destroy?.();
        
        // Reset to safe state
        if (!stateManager.isInHomeState()) {
            stateManager.setState(AppStates.HOME);
        }
        
        this.isNavigating = false;
    }

    abort() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    isCurrentlyNavigating() {
        return this.isNavigating;
    }
}

export const blogNavigator = new BlogNavigator();
export default blogNavigator;
