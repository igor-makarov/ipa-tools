# -*- mode: ruby -*-
# vi: set ft=ruby :

unless Vagrant.has_plugin?('vagrant-scp')
  raise 'Please run `vagrant plugin install vagrant-scp`'
end

Vagrant.configure('2') do |config|
  config.vm.provider 'virtualbox' do |v|
    v.gui = true
    v.name = 'Ipa Hacking'
  end

  config.vm.box = 'igormaka/itunes-automation'

  config.vm.synced_folder '.', '/Users/vagrant/scripts',
                          type: :rsync,
                          rsync__chown: false

  config.vm.provision 'shell',
                      privileged: true,
                      inline: 'sudo chown -R vagrant:staff scripts'
end
