import type { Metadata } from 'next';
import { HomeCollection } from '../components/home-collection';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';

export const metadata: Metadata = { title: '创作归档 — JING AI PLAYGROUND', description: '荆此前的 AI 创作、工具、笔记和收藏。' };

export default function Archive() {
  return <main><SiteHeader /><HomeCollection /><SiteFooter /></main>;
}
