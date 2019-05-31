import HttpError from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import { Config, KubeConfig, Core_v1Api } from '@kubernetes/client-node';
import * as fs from 'fs';
import fetch from 'node-fetch';

/**
 * @export
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns {Promise < void >}
 */
export async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

        // TODO: put the home page content into redis can cache it for 1min
        let url: string
        if (process.env.NODE_ENV === 'development') {
            url = process.env.HOME_URL
        } else {
            url = await loadFromKubernetes()
            console.log(`URL from configmap is ${url}`)
        }

        // url = await loadFromKubernetes('mc')
        // console.log(`URL from configmap is ${url}`)

        let fe = await fetch(url)
        if (fe.status === 200) {
            let body = await fe.text()
            res.send(body)
        } else {
            throw new Error(`Error loading home page, ${fe.status}`)
        }
    } catch (error) {
        return next(new HttpError(500, error.message));
    }
}

async function loadFromKubernetes(namespace?: string): Promise<string> {

    if (!namespace) {
        namespace = fs.readFileSync(`${Config.SERVICEACCOUNT_ROOT}/namespace`).toString();
    }
    const labelSelector = "role=cdn,host=scaffold-node";

    const kc = new KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(Core_v1Api);

    try {
        let res = await k8sApi.listNamespacedConfigMap(namespace, undefined, undefined, undefined, undefined, labelSelector)
        let items = res.body.items
        if (items.length >= 1) {
            let data = items[0].data
            // TODO: CDN domain name should not be hardcoded!
            return `https://cdn.aweval.com/static/${data.alias}/${data.commit}/index.html`
        } else {
            throw new Error('No UI content found. Has scaffold-react been deployed?')
        }
    } catch (error) {
        throw new HttpError(500, error.body.message)
    }
}
