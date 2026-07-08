#!/usr/bin/env node

import { execFileSync } from 'node:child_process'

execFileSync('husky', [], { stdio: 'inherit' })
